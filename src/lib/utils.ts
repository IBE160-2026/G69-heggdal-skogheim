import { createCn } from "cn/config"

// Uten disse tolker cn tokenene som tekstfarge, ikke skriftstørrelse.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["page-title", "section-title", "letter", "hit-rate", "label"] },
      ],
    },
  },
})
