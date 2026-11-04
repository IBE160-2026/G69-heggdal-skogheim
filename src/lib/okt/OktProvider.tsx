"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

import { hentStatus } from "./status";
import {
  reducer,
  startTilstand as standardTilstand,
  type OktHandling,
  type OktTilstand,
} from "./tilstand";

type OktKontekst = {
  tilstand: OktTilstand;
  dispatch: Dispatch<OktHandling>;
};

const Kontekst = createContext<OktKontekst | null>(null);

export function OktProvider({
  children,
  startTilstand = standardTilstand,
}: {
  children: ReactNode;
  startTilstand?: OktTilstand;
}) {
  const [tilstand, dispatch] = useReducer(reducer, startTilstand);

  useEffect(() => {
    let aktiv = true;

    void hentStatus().then((status) => {
      if (aktiv) dispatch({ type: "statusHentet", status });
    });

    return () => {
      aktiv = false;
    };
  }, []);

  const verdi = useMemo(() => ({ tilstand, dispatch }), [tilstand]);

  return <Kontekst.Provider value={verdi}>{children}</Kontekst.Provider>;
}

export function useOkt(): OktKontekst {
  const verdi = useContext(Kontekst);
  if (!verdi) throw new Error("useOkt må brukes inne i OktProvider.");

  return verdi;
}
