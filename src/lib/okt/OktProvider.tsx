"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";

import { hentGenerering } from "./generer";
import { hentStatus } from "./status";
import {
  reducer,
  startTilstand as standardTilstand,
  type GenerertResultatdel,
  type Kjoring,
  type OktHandling,
  type OktTilstand,
} from "./tilstand";

type OktKontekst = {
  tilstand: OktTilstand;
  dispatch: Dispatch<OktHandling>;
  startGenerering: (resultatdel: GenerertResultatdel) => void;
};

// En generering som er sendt og ikke ferdig. Kjøringen sammenlignes som objekt, så en
// ny kjøring aldri forveksles med en gammel.
type Aktiv = { kjoring: Kjoring; kontroller: AbortController };

const Kontekst = createContext<OktKontekst | null>(null);

export function OktProvider({
  children,
  startTilstand = standardTilstand,
}: {
  children: ReactNode;
  startTilstand?: OktTilstand;
}) {
  const [tilstand, dispatch] = useReducer(reducer, startTilstand);
  // Siste tilstand for `startGenerering`, som kalles fra effekter og hendelser.
  const sist = useRef(tilstand);
  const aktive = useRef<Partial<Record<GenerertResultatdel, Aktiv>>>({});

  useEffect(() => {
    sist.current = tilstand;
  }, [tilstand]);

  useEffect(() => {
    let aktiv = true;

    void hentStatus().then((status) => {
      if (aktiv) dispatch({ type: "statusHentet", status });
    });

    return () => {
      aktiv = false;
    };
  }, []);

  // AD-6: bare denne funksjonen sender requester. En generering som allerede går for
  // samme kjøring, startes ikke på nytt (også i StrictMode). En generering for en
  // gammel kjøring avbrytes.
  const startGenerering = useCallback((resultatdel: GenerertResultatdel) => {
    const { kjoring, gapVersjon: forrige } = sist.current.innhold;
    if (!kjoring) return;

    const pagaende = aktive.current[resultatdel];
    if (pagaende?.kjoring === kjoring) return;
    pagaende?.kontroller.abort();

    const kontroller = new AbortController();
    const denne: Aktiv = { kjoring, kontroller };
    aktive.current[resultatdel] = denne;

    const gapVersjon = forrige + 1;
    const merke = { resultatdel, kjoringId: kjoring.id, gapVersjon };
    dispatch({ type: "genereringStartet", ...merke });

    void hentGenerering(
      resultatdel,
      {
        cvTekst: kjoring.cvTekst,
        annonse: kjoring.annonse,
        demo: kjoring.erEksempel,
      },
      kontroller.signal,
    ).then((svar) => {
      if (aktive.current[resultatdel] === denne) {
        delete aktive.current[resultatdel];
      }
      if (!svar) return;
      dispatch(
        svar.ok
          ? { type: "genereringFerdig", ...merke, data: svar.data }
          : { type: "genereringFeilet", ...merke, feilkode: svar.feilkode },
      );
    });
  }, []);

  const { kjoring } = tilstand.innhold;
  const gapStatus = tilstand.innhold.resultatdeler.gap?.status;

  // En ny kjøring starter gap-analysen. Uten kjøring avbrytes det som går. Effekten har
  // ingen opprydding, for StrictMode ville da avbrutt og sendt requesten to ganger.
  useEffect(() => {
    if (!kjoring) {
      for (const pagaende of Object.values(aktive.current)) {
        pagaende.kontroller.abort();
      }
      aktive.current = {};
      return;
    }
    if (gapStatus === "venter") startGenerering("gap");
  }, [kjoring, gapStatus, startGenerering]);

  const verdi = useMemo(
    () => ({ tilstand, dispatch, startGenerering }),
    [tilstand, startGenerering],
  );

  return <Kontekst.Provider value={verdi}>{children}</Kontekst.Provider>;
}

export function useOkt(): OktKontekst {
  const verdi = useContext(Kontekst);
  if (!verdi) throw new Error("useOkt må brukes inne i OktProvider.");

  return verdi;
}
