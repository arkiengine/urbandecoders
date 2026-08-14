/* @ds-bundle: {"format":4,"namespace":"UrbanDecodersDesignSystem_ad2426","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"EmailMockup","sourcePath":"components/cards/EmailMockup.jsx"},{"name":"FeatureCard","sourcePath":"components/cards/FeatureCard.jsx"},{"name":"PricingTier","sourcePath":"components/cards/PricingTier.jsx"},{"name":"CodeWindow","sourcePath":"components/code/CodeWindow.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Logo","sourcePath":"components/navigation/Logo.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"BadgePill","sourcePath":"components/signature/BadgePill.jsx"},{"name":"ContributorAvatar","sourcePath":"components/signature/ContributorAvatar.jsx"},{"name":"StatusDot","sourcePath":"components/signature/StatusDot.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"317e206f32a9","components/cards/EmailMockup.jsx":"f1658084acfd","components/cards/FeatureCard.jsx":"1371c690b62e","components/cards/PricingTier.jsx":"29bdf6856dbb","components/code/CodeWindow.jsx":"727275c7b326","components/forms/TextInput.jsx":"15562f152e0b","components/navigation/Footer.jsx":"3647c3c089f7","components/navigation/Logo.jsx":"16bcfb41a0d3","components/navigation/NavBar.jsx":"6c7d64680924","components/signature/BadgePill.jsx":"0d54ca67c8a9","components/signature/ContributorAvatar.jsx":"ffd0ee08eb58","components/signature/StatusDot.jsx":"5e30a1945981","ui_kits/marketing/Sections.jsx":"35e4ff8af532"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.UrbanDecodersDesignSystem_ad2426 = window.UrbanDecodersDesignSystem_ad2426 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RADIUS = 'var(--ud-radius-md)';
const VARIANTS = {
  primary: {
    background: 'var(--ud-primary)',
    color: 'var(--ud-primary-on)',
    border: '1px solid var(--ud-primary)'
  },
  ghost: {
    background: 'var(--ud-surface-elevated)',
    color: 'var(--ud-ink)',
    border: '1px solid var(--ud-hairline-strong)'
  },
  outline: {
    background: 'var(--ud-canvas)',
    color: 'var(--ud-ink)',
    border: '1px solid var(--ud-hairline-strong)'
  },
  brand: {
    background: 'var(--ud-brand-gradient)',
    color: 'var(--ud-ink)',
    border: '1px solid transparent'
  }
};
const SIZES = {
  md: {
    height: 36,
    padding: '0 16px',
    fontSize: 14,
    letterSpacing: 0
  },
  sm: {
    height: 30,
    padding: '0 12px',
    fontSize: 13,
    letterSpacing: 0.2
  },
  lg: {
    height: 44,
    padding: '0 22px',
    fontSize: 15,
    letterSpacing: 0
  }
};

/**
 * Button — the primary interactive control.
 * `primary` is a white rectangle with black text: the brightest pixel on
 * the black canvas, used at most once per viewport. `brand` uses the teal
 * gradient. `ghost` / `outline` are equal- and lower-weight secondaries.
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.height,
      padding: s.padding,
      borderRadius: RADIUS,
      fontFamily: 'var(--ud-font-sans)',
      fontSize: s.fontSize,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: s.letterSpacing,
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'filter 120ms ease, background 120ms ease, opacity 120ms ease',
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (!disabled && variant === 'primary') e.currentTarget.style.background = 'var(--ud-surface-light)';
    },
    onMouseLeave: e => {
      if (!disabled && variant === 'primary') e.currentTarget.style.background = 'var(--ud-primary)';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/EmailMockup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * EmailMockup — a light-island inset card. The only deliberately-light
 * surface in the system; reads like a print pull-quote lifted off the
 * black canvas. Default is a white card; `dark` keeps it on card surface.
 */
function EmailMockup({
  from = 'Urban Decoders',
  subject,
  preview = null,
  dark = false,
  children,
  style = {},
  ...rest
}) {
  const light = !dark;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: '100%',
      maxWidth: 420,
      overflow: 'hidden',
      background: light ? '#ffffff' : 'var(--ud-surface-card)',
      border: light ? '1px solid rgba(0,0,0,0.08)' : '1px solid var(--ud-hairline-strong)',
      borderRadius: 'var(--ud-radius-lg)',
      fontFamily: 'var(--ud-font-sans)',
      color: light ? 'var(--ud-on-light)' : 'var(--ud-ink)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '16px 20px',
      borderBottom: light ? '1px solid rgba(0,0,0,0.06)' : '1px solid var(--ud-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--ud-radius-full)',
      background: 'var(--ud-brand-gradient)',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, from), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: light ? 'var(--ud-on-light-mute)' : 'var(--ud-mute)'
    }
  }, subject))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px',
      fontSize: 14,
      lineHeight: 1.6,
      color: light ? 'rgba(0,0,51,0.82)' : 'var(--ud-body)'
    }
  }, children || preview));
}
Object.assign(__ds_scope, { EmailMockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/EmailMockup.jsx", error: String((e && e.message) || e) }); }

// components/cards/FeatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FeatureCard — feature highlight card. Card surface, 32px padding,
 * 12px radius. `bordered` adds an explicit hairline; `glow` anchors a
 * teal atmospheric wash at the card's top edge. `highlight` promotes the
 * card with a deep-red rim + wash — reserve for one box per view.
 */
function FeatureCard({
  title,
  eyebrow = null,
  icon = null,
  bordered = false,
  glow = false,
  highlight = false,
  children,
  style = {},
  ...rest
}) {
  const border = highlight ? '1px solid var(--ud-emphasis-red-border)' : bordered ? '1px solid var(--ud-hairline-strong)' : '1px solid var(--ud-hairline)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--ud-surface-card)',
      border,
      boxShadow: highlight ? 'inset 0 1px 0 var(--ud-emphasis-red-bright)' : 'none',
      borderRadius: 'var(--ud-radius-lg)',
      padding: 'var(--ud-space-xxl, 32px)',
      fontFamily: 'var(--ud-font-sans)',
      color: 'var(--ud-ink)',
      ...style
    }
  }, rest), glow && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--ud-glow-brand)',
      pointerEvents: 'none'
    }
  }), highlight && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--ud-glow-emphasis)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      color: highlight ? 'var(--ud-emphasis-red-bright)' : 'var(--ud-brand-teal-light)'
    }
  }, icon), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ud-font-techno)',
      fontSize: 12,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: highlight ? 'var(--ud-emphasis-red-bright)' : 'var(--ud-mute)',
      marginBottom: 10
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 10px',
      fontFamily: 'var(--ud-font-sans)',
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: '-0.3px',
      lineHeight: 1.3
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--ud-body)',
      letterSpacing: '-0.2px'
    }
  }, children)));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/PricingTier.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PricingTier — pricing plan card. `featured` promotes the surface one
 * elevation step (luminance, not colour). Price renders in the serif
 * display face at 56px.
 */
function PricingTier({
  name,
  price,
  period = '/mo',
  blurb = null,
  features = [],
  cta = 'Get started',
  ctaVariant,
  featured = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: featured ? 'var(--ud-surface-elevated)' : 'var(--ud-surface-card)',
      border: '1px solid var(--ud-hairline-strong)',
      borderRadius: 'var(--ud-radius-lg)',
      padding: 'var(--ud-space-xxl, 32px)',
      fontFamily: 'var(--ud-font-sans)',
      color: 'var(--ud-ink)',
      ...style
    }
  }, rest), featured && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 20,
      right: 20,
      fontFamily: 'var(--ud-font-techno)',
      fontSize: 11,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: 'var(--ud-brand-teal-light)'
    }
  }, "Recommended"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 500,
      letterSpacing: '-0.4px'
    }
  }, name), blurb && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: 'var(--ud-mute)',
      lineHeight: 1.5
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      margin: '24px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ud-font-display)',
      fontSize: 56,
      fontWeight: 400,
      lineHeight: 1,
      letterSpacing: '-1.4px'
    }
  }, price), period && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--ud-ash)'
    }
  }, period)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: ctaVariant || (featured ? 'primary' : 'ghost'),
    style: {
      width: '100%'
    }
  }, cta), features.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '24px 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      fontSize: 14,
      color: 'var(--ud-body)',
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ud-brand-teal-light)',
      flex: '0 0 auto'
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, f)))));
}
Object.assign(__ds_scope, { PricingTier });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PricingTier.jsx", error: String((e && e.message) || e) }); }

// components/code/CodeWindow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CodeWindow — code well (level-3 surface). Traffic-light chrome row,
 * optional language tabs, monospace body. This is the only place all
 * three semantic colours appear together as solid dots.
 */
function CodeWindow({
  tabs = [],
  activeTab = 0,
  onTabChange = null,
  title = null,
  children,
  style = {},
  ...rest
}) {
  const [active, setActive] = React.useState(activeTab);
  const cur = onTabChange ? activeTab : active;
  const setCur = i => {
    setActive(i);
    onTabChange && onTabChange(i);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--ud-surface-deep)',
      border: '1px solid var(--ud-hairline-strong)',
      borderRadius: 'var(--ud-radius-lg)',
      overflow: 'hidden',
      fontFamily: 'var(--ud-font-mono)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      borderBottom: '1px solid var(--ud-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: 'var(--ud-radius-full)',
      background: 'var(--ud-accent-red)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: 'var(--ud-radius-full)',
      background: 'var(--ud-accent-yellow)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: 'var(--ud-radius-full)',
      background: 'var(--ud-accent-green)'
    }
  })), title && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      fontSize: 12,
      color: 'var(--ud-mute)'
    }
  }, title)), tabs.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      padding: '10px 14px 0'
    }
  }, tabs.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setCur(i),
    style: {
      padding: '6px 12px',
      borderRadius: 'var(--ud-radius-sm)',
      border: 'none',
      cursor: 'pointer',
      background: i === cur ? 'var(--ud-surface-card)' : 'transparent',
      color: i === cur ? 'var(--ud-ink)' : 'var(--ud-charcoal)',
      borderBottom: i === cur ? '1px solid var(--ud-hairline-strong)' : '1px solid transparent',
      fontFamily: 'var(--ud-font-mono)',
      fontSize: 13,
      lineHeight: 1.6
    }
  }, t))), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: '20px 24px',
      overflowX: 'auto',
      fontSize: 13,
      lineHeight: 1.6,
      color: 'var(--ud-body)',
      fontFamily: 'var(--ud-font-mono)'
    }
  }, children));
}
Object.assign(__ds_scope, { CodeWindow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/code/CodeWindow.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TextInput — default form field. 40px tall, card surface, hairline border.
 * Focus thickens the border to ink (no separate ring colour).
 */
function TextInput({
  label = null,
  hint = null,
  invalid = false,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const border = invalid ? '1px solid var(--ud-accent-red)' : focused ? '1px solid var(--ud-ink)' : '1px solid var(--ud-hairline-strong)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--ud-font-sans)',
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--ud-charcoal)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      height: 40,
      padding: '10px 14px',
      borderRadius: 'var(--ud-radius-md)',
      background: 'var(--ud-surface-card)',
      color: 'var(--ud-ink)',
      border,
      outline: 'none',
      fontFamily: 'var(--ud-font-sans)',
      fontSize: 14,
      transition: 'border-color 120ms ease',
      boxSizing: 'border-box',
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: invalid ? 'var(--ud-accent-red)' : 'var(--ud-ash)'
    }
  }, hint));
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Logo — Urban Decoders brand mark. `variant`:
 *   'lockup'   badge + wordmark image (default)
 *   'badge'    circular gradient badge only
 *   'monogram' white UD monogram (for dark canvas)
 *   'wordmark' techno-type wordmark rendered as live text
 * Asset paths resolve relative to the design-system root; pass `assetBase`
 * to point at the assets folder from a nested page.
 */
function Logo({
  variant = 'lockup',
  height = 32,
  assetBase = 'assets',
  style = {},
  ...rest
}) {
  const src = {
    lockup: `${assetBase}/ud-lockup.png`,
    badge: `${assetBase}/ud-badge-circle.png`,
    monogram: `${assetBase}/ud-monogram-white.png`
  };
  if (variant === 'wordmark') {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        fontFamily: 'var(--ud-font-techno)',
        fontWeight: 700,
        fontSize: height * 0.7,
        letterSpacing: 0.5,
        color: 'var(--ud-ink)',
        whiteSpace: 'nowrap',
        ...style
      }
    }, rest), "Urban Decoders");
  }
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src[variant] || src.lockup,
    alt: "Urban Decoders",
    style: {
      height,
      width: 'auto',
      display: 'block',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Logo.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * NavBar — top navigation. 64px tall, canvas background, single hairline
 * bottom border. Wordmark left, centre links, sign-in + white CTA right.
 */
function NavBar({
  links = ['Platform', 'Solutions', 'Docs', 'Pricing'],
  active = null,
  cta = 'Request access',
  assetBase = 'assets',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64,
      padding: '0 32px',
      boxSizing: 'border-box',
      background: 'var(--ud-canvas)',
      borderBottom: '1px solid var(--ud-hairline)',
      fontFamily: 'var(--ud-font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "badge",
    height: 30,
    assetBase: assetBase
  }), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "wordmark",
    height: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: 14,
      letterSpacing: 0.35,
      textDecoration: 'none',
      color: l === active ? 'var(--ud-ink)' : 'var(--ud-charcoal)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 14,
      letterSpacing: 0.35,
      textDecoration: 'none',
      color: 'var(--ud-body)'
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm"
  }, cta)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/signature/BadgePill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BadgePill — small neutral inline tag ("New", "Beta", "v3.0").
 * Also used as a techno eyebrow when `tone="brand"`.
 */
function BadgePill({
  tone = 'neutral',
  children,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      background: 'var(--ud-surface-elevated)',
      color: 'var(--ud-body)',
      border: '1px solid var(--ud-hairline-strong)'
    },
    brand: {
      background: 'rgba(47,138,169,0.12)',
      color: 'var(--ud-brand-teal-light)',
      border: '1px solid rgba(47,138,169,0.35)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ud-charcoal)',
      border: '1px solid var(--ud-hairline-strong)'
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 'var(--ud-radius-full)',
      fontFamily: 'var(--ud-font-sans)',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: 0.2,
      whiteSpace: 'nowrap',
      ...t,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { BadgePill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signature/BadgePill.jsx", error: String((e && e.message) || e) }); }

// components/signature/ContributorAvatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ContributorAvatar — 32px circular avatar for inline testimonials.
 * Falls back to monogram initials on a card-surface placeholder.
 */
function ContributorAvatar({
  src = null,
  initials = 'UD',
  size = 32,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: 'var(--ud-radius-full)',
      overflow: 'hidden',
      flex: '0 0 auto',
      background: 'var(--ud-surface-card)',
      border: '1px solid var(--ud-hairline-strong)',
      fontFamily: 'var(--ud-font-techno)',
      fontSize: Math.round(size * 0.36),
      fontWeight: 600,
      color: 'var(--ud-mute)',
      letterSpacing: 0.5,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { ContributorAvatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signature/ContributorAvatar.jsx", error: String((e && e.message) || e) }); }

// components/signature/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** StatusDot — 8px inline indicator. Green = operational by default. */
function StatusDot({
  tone = 'green',
  pulse = false,
  style = {},
  ...rest
}) {
  const map = {
    green: 'var(--ud-accent-green)',
    yellow: 'var(--ud-accent-yellow)',
    red: 'var(--ud-accent-red)',
    blue: 'var(--ud-accent-blue)',
    brand: 'var(--ud-brand-teal-light)'
  };
  const c = map[tone] || map.green;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: 'var(--ud-radius-full)',
      background: c,
      boxShadow: pulse ? `0 0 0 3px color-mix(in srgb, ${c} 25%, transparent)` : 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signature/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Footer — global footer. Multi-column quick-links grid above a single
 * copyright row separated by a soft divider.
 */
function Footer({
  columns = DEFAULT_COLUMNS,
  assetBase = 'assets',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: 'var(--ud-canvas)',
      padding: '64px 32px 40px',
      boxSizing: 'border-box',
      fontFamily: 'var(--ud-font-sans)',
      color: 'var(--ud-charcoal)',
      borderTop: '1px solid var(--ud-hairline)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 48,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 260
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "monogram",
    height: 34,
    assetBase: assetBase
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--ud-ash)'
    }
  }, "Architectural & masterplanning digital twins, rendered in a dark studio."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 20,
      fontSize: 13,
      color: 'var(--ud-mute)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusDot, {
    tone: "green"
  }), " All systems operational")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 56,
      flexWrap: 'wrap'
    }
  }, columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ud-font-techno)',
      fontSize: 12,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: 'var(--ud-mute)'
    }
  }, col.title), col.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    href: "#",
    style: {
      fontSize: 14,
      textDecoration: 'none',
      color: 'var(--ud-charcoal)'
    }
  }, it)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '48px auto 0',
      paddingTop: 24,
      borderTop: '1px solid var(--ud-divider-soft)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      fontSize: 12,
      color: 'var(--ud-ash)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Urban Decoders. All rights reserved."), /*#__PURE__*/React.createElement("span", null, "Built for the built environment.")));
}
const DEFAULT_COLUMNS = [{
  title: 'Platform',
  items: ['Digital Twin', 'Masterplan Sync', 'Viewer', 'API']
}, {
  title: 'Company',
  items: ['About', 'Customers', 'Careers', 'Contact']
}, {
  title: 'Resources',
  items: ['Docs', 'Changelog', 'Status', 'Security']
}];
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Urban Decoders marketing — Hero + atmospheric sections.
   Composes design-system primitives from window.UrbanDecodersDesignSystem_ad2426.
   Exports to window for the index.html entry. */
const DS = window.UrbanDecodersDesignSystem_ad2426;
const A = "../../assets";
function Eyebrow({
  children,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ud-font-techno)',
      fontSize: 13,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: color || 'var(--ud-brand-teal-light)'
    }
  }, children);
}
function Hero({
  onGetStarted
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '112px 32px 96px',
      textAlign: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(50% 460px at 50% -6%, var(--ud-brand-glow), transparent 68%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 900,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(DS.BadgePill, {
    tone: "brand"
  }, "Digital twins for the built environment")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--ud-font-display)',
      fontWeight: 400,
      fontSize: 'clamp(44px, 8vw, 96px)',
      lineHeight: 1.0,
      letterSpacing: '-0.03em',
      color: 'var(--ud-ink)'
    }
  }, "The city, decoded."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '26px auto 0',
      maxWidth: 620,
      fontSize: 20,
      lineHeight: 1.5,
      color: 'var(--ud-body)'
    }
  }, "Urban Decoders turns masterplans and architecture into live, navigable digital twins \u2014 rendered in a dark studio, synced to the real world."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(DS.Button, {
    variant: "primary",
    size: "lg",
    onClick: onGetStarted
  }, "Request access"), /*#__PURE__*/React.createElement(DS.Button, {
    variant: "ghost",
    size: "lg"
  }, "Watch the twin"))));
}
function FeatureGrid() {
  const items = [{
    eyebrow: 'Sync',
    title: 'Live masterplan sync',
    body: 'Every parcel, setback and massing edit propagates to the twin in seconds — no re-export, no drift.'
  }, {
    eyebrow: 'Fidelity',
    title: 'Rendered in a dark studio',
    body: 'Photoreal geometry lit like a physical model, so stakeholders read the plan the way they read a maquette.'
  }, {
    eyebrow: 'Context',
    title: 'Everything in your context',
    body: 'Zoning, terrain, transit and daylight layered on one model — decisions grounded in the whole picture.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Platform"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '14px 0 0',
      fontFamily: 'var(--ud-font-display)',
      fontWeight: 400,
      fontSize: 'clamp(34px,5vw,56px)',
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--ud-ink)'
    }
  }, "A model that keeps up with the plan.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 20
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(DS.FeatureCard, {
    key: i,
    eyebrow: it.eyebrow,
    title: it.title,
    glow: i === 0,
    highlight: i === 2,
    bordered: true
  }, it.body)))));
}
function CodeStory() {
  const snippet = `import { Twin } from "@urbandecoders/sdk";

// Spin up a twin from a parcel + LOD target
const twin = await Twin.create({
  parcel: "riverside.geojson",
  lod: 3,
  context: ["zoning", "terrain", "transit"],
});

// Push a design change; the twin re-syncs live
await twin.apply(masterplan.revision("v12"));
await twin.sync();`;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '96px 32px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(46% 420px at 78% 0%, var(--ud-accent-blue-glow), transparent 66%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.15fr)',
      gap: 56,
      alignItems: 'center'
    },
    className: "ud-split"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--ud-accent-blue)"
  }, "Integrate this weekend"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '14px 0 18px',
      fontFamily: 'var(--ud-font-display)',
      fontWeight: 400,
      fontSize: 'clamp(30px,4vw,48px)',
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--ud-ink)'
    }
  }, "An SDK that speaks planner."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 18,
      lineHeight: 1.55,
      color: 'var(--ud-body)'
    }
  }, "Create a twin from a single parcel file, attach the context layers you care about, and stream design revisions straight into the model."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(DS.Button, {
    variant: "brand"
  }, "Read the docs"), /*#__PURE__*/React.createElement(DS.Button, {
    variant: "outline"
  }, "API reference"))), /*#__PURE__*/React.createElement(DS.CodeWindow, {
    title: "twin.ts",
    tabs: ['TypeScript', 'Python', 'cURL']
  }, snippet)));
}
function EmailBand() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '112px 32px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(50% 440px at 50% 0%, var(--ud-brand-glow), transparent 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 640,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Beyond experience"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '14px 0 40px',
      fontFamily: 'var(--ud-font-display)',
      fontWeight: 400,
      fontSize: 'clamp(30px,4vw,52px)',
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--ud-ink)'
    }
  }, "The twin, delivered."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(DS.EmailMockup, {
    from: "Urban Decoders",
    subject: "Riverside masterplan \xB7 twin ready"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ud-font-display)',
      fontSize: 22,
      color: 'var(--ud-on-light)',
      lineHeight: 1.2,
      marginBottom: 12
    }
  }, "Your twin finished processing."), "All 214 parcels resolved at LOD\xA03. Daylight and transit context are attached. Open the viewer to walk the model.", /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'inline-block',
      background: '#000',
      color: '#fff',
      fontFamily: 'var(--ud-font-sans)',
      fontSize: 13,
      fontWeight: 500,
      padding: '9px 16px',
      borderRadius: 8
    }
  }, "Open viewer")))));
}
function Pricing() {
  const tiers = [{
    name: 'Studio',
    price: '$0',
    blurb: 'For solo planners exploring a single site.',
    features: ['1 active twin', 'Web viewer', 'Community support'],
    cta: 'Start free'
  }, {
    name: 'Practice',
    price: '$490',
    blurb: 'For firms running live masterplans.',
    features: ['25 active twins', 'Context layers', 'SDK + API access', 'Priority support'],
    cta: 'Request access',
    featured: true
  }, {
    name: 'City',
    price: 'Custom',
    period: '',
    blurb: 'For agencies and city-scale programs.',
    features: ['Unlimited twins', 'On-prem option', 'SSO + audit logs', 'Dedicated engineer'],
    cta: 'Talk to us'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 52
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '14px 0 0',
      fontFamily: 'var(--ud-font-display)',
      fontWeight: 400,
      fontSize: 'clamp(30px,4vw,52px)',
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--ud-ink)'
    }
  }, "Priced on quality.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 20,
      alignItems: 'start'
    }
  }, tiers.map((t, i) => /*#__PURE__*/React.createElement(DS.PricingTier, _extends({
    key: i
  }, t))))));
}
Object.assign(window, {
  UDHero: Hero,
  UDFeatureGrid: FeatureGrid,
  UDCodeStory: CodeStory,
  UDEmailBand: EmailBand,
  UDPricing: Pricing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.EmailMockup = __ds_scope.EmailMockup;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.PricingTier = __ds_scope.PricingTier;

__ds_ns.CodeWindow = __ds_scope.CodeWindow;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.BadgePill = __ds_scope.BadgePill;

__ds_ns.ContributorAvatar = __ds_scope.ContributorAvatar;

__ds_ns.StatusDot = __ds_scope.StatusDot;

})();
