# Research-digest (webresearch, 2026-10-29)

Kort oppsummering fra research-subagent. Fullstendige kilder i memlog-hendelse og nedenfor.

- **Sammenlignbare:** Jobscan (match-score, manglende nøkkelord), Teal/Rezi (CV-bygging). Kritikk: scorer varierer mellom verktøy, nøkkelordstapping, Teal påstått å dikte opp detaljer. Ingen KI-søknadsverktøy fra NAV funnet; norsk/student/gjennomsiktig score er en nisje.
- **Hindre oppdiktning:** «kun fakta fra CV-en»-instruks; strukturert output med påstand + CV-sitat; kontroll i kode av at sitatet finnes i CV-teksten; flagg påstander uten belegg; lav temperatur. arXiv 2607.01457 (preprint, syntetiske CV-er): 2,5–5,4 hallusinasjoner/CV uten forsvar → 0,04–0,24 med flerlagsforsvar.
- **Tokolonne-PDF:** leserekkefølge kan flettes. Viktigste tiltak: la brukeren forhåndsvise og redigere uttrukket tekst før analyse; advar ved lite/ingen tekst (skannet PDF); tokolonne-CV i testsettet. Uttrekk i nettleser (pdfjs-dist, mammoth) gir bare tekst til server.
- **Vercel:** Hobby/Fluid maks 300 s, 4,5 MB body-grense (413), strømming anbefalt, nøkkel som server-miljøvariabel (aldri NEXT_PUBLIC_), standardregion iad1 (kan settes til EU), ikke logg CV-tekst/prompter.
- **GDPR:** CV = personopplysninger, mulig særlige kategorier; USA-leverandør = tredjelandsoverføring (DPF dekker kun sertifiserte). Tiltak: tydelig info før opplasting, bekreftelsessteg, råd om å fjerne personnummer/bilde/helse, evt. enkel maskering, ingen innholdslogging, ikke Files API, leverandør med DPA og uten trening på API-data. Ikke verifisert direkte: Datatilsynets ferskeste KI-veiledning, Anthropics DPA/treningsvilkår.

Kilder: jobscan.co/blog/jobscan-vs-rezi, arxiv.org/abs/2607.01457, pymupdf.readthedocs.io/en/latest/recipes-text.html, vercel.com/docs/functions/limitations, vercel.com/docs/limits, platform.claude.com/docs/build-with-claude/api-and-data-retention, svw.no/en/new-framework-for-data-transfers-to-the-us/, ks.no (vedlegg-7-kunstig-intelligens.pdf).
