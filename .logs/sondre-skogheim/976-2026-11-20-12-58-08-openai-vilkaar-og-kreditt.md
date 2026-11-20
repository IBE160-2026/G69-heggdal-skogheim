# OpenAI: vilkår, DPA og kreditt før produksjon

## 2026-11-20 kl. 12:58 — Sondre Skogheim

### Oppgave
Kevin planlegger story 2.4 del C (produksjon) og ba Sondre bekrefte tre ting før ekte CV-er brukes i produksjon: at datadeling og trening er av, at DPA-en gjelder, og at kreditten er under 200 kr med automatisk påfyll av.

### Plan
- Sondre sjekker innstillingene i OpenAI selv. Claude har ikke tilgang til kontoen.
- Lese første avsnitt i OpenAIs Data Processing Addendum.

### Resultat
- **Leverandørvalg (Kevin og Sondre):** OpenAI gpt-4.1-mini med temperatur 0, etter valgregelen i AD-11 (Mistral Medium 3.5 bestod ikke). Siste måling: SM-2 og SM-3 bestått i 12 av 12, SM-1 i 9 av 12 (to krav i par 3 under fasit), ca. 0,07 kr per kjøring.
- **Datadeling:** sjekket av Sondre under Settings → Data controls → Sharing.
- **DPA:** gjelder automatisk. Første avsnitt sier at den er innlemmet i OpenAI-tjenesteavtalen og godtas ved bruk av tjenestene. For kunder i EØS er avtaleparten OpenAI Ireland Ltd.
- **Kreditt:** ett manuelt kjøp 2026-11-19, 5 dollar + 25 % mva. = 6,25 dollar (ca. 60 kr). Automatisk påfyll er av. Under grensen på 200 kr (NFR-3).
- Svarene er sendt til Kevin.

### Åpne punkter
- SM-1 er ikke bestått (9 av 12, par 3). Må løses før innleveringen. Vurder om fasiten for de to kravene («Ikke direkte dokumentert») eller modellen tar feil.
- Når 2.4 er flettet: egen produksjonsnøkkel og miljøvariabler i Vercel (bare Production), og sjekk at demobanneret er borte.
