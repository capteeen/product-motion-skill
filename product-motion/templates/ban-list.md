# Starting ban list

Without design direction the model falls back on a few default styles. A general line like "avoid a generic AI look" only swaps one default for another. Ban the exact patterns by name.

```
BANNED:
- purple or blue gradients
- glow, glow orbs, neon, lens flares, bloom (unless an emissive is the subject)
- floating particles as decoration
- everything fading in at once
- fade-and-slide-up on every element
- centered-everything layouts
- text that moves while it is being read
- generic spinning turntables
- dark navy "space" backgrounds and halo rings
- made-up taglines or text nobody asked for
- linear easing on any move
```

Keep it alive: after every first render, list which defaults appeared anyway, ban each by name, and render again. Store project-specific additions at the top of the prompt.
