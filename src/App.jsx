import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Retune } from 'retune'

const MOTION = { type: 'tween', ease: 'linear', duration: 0.18 }

/* Noontree dirham (AED) glyph — private-use codepoint U+E001 */
const DH = ''
function Dh() {
  return <span className="dh" aria-label="AED">{DH}</span>
}

export default function App() {
  return (
    <div className="stage">
      <div className="phone">
        <PDP />
      </div>
      <Retune force />
    </div>
  )
}

function PDP() {
  const [cartOpen, setCartOpen] = useState(false)
  const [view, setView] = useState('pdp')
  const [cartQty, setCartQty] = useState({})

  if (view === 'checkout') return <Checkout onBack={() => setView('pdp')} cartQty={cartQty} />

  return (
    <div className="pdp">
      <StatusBar />
      <div className="pdp-scroll">
        <Gallery />
        <div className="pdp-sections">
          <MainInfo />
          <Delivery />
          <Trustmarkers />
          <ProductDetails />
          <AdditionalInfo />
          <SellerWidget />
        </div>
      </div>
      <BottomNav onAddToCart={() => setCartOpen(true)} />
      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        qty={cartQty}
        setQty={setCartQty}
        onCheckout={() => { setCartOpen(false); setView('checkout') }}
      />
    </div>
  )
}

/* -------------------------------- Bottom nav ------------------------------- */
function BottomNav({ onAddToCart }) {
  return (
    <div className="pdp-bottomnav">
      <div className="pdp-bottomnav-row">
        <div className="qty-box">
          <span className="qty-label">QTY</span>
          <span className="qty-val">1</span>
        </div>
        <button className="cta buy-now">Buy now</button>
        <button className="cta add-cart" onClick={onAddToCart}>Add to cart</button>
      </div>
      <div className="home-bar"><span /></div>
    </div>
  )
}

/* ------------------------ Add-to-cart bottom sheet ------------------------ */
const PAB_PRODUCTS = [
  { id: 'p1', img: '/pab-powerbank.png', fit: 'cover', title: 'Anker magnetic power bank for easy and fast charging', price: '160', was: '453' },
  { id: 'p2', img: '/pab-anker737.png', fit: 'contain', title: 'Anker 737 Power Bank (PowerCore 24K3), 24,000mAh 3-Port Portable Charger with 140W Output, Smart Digital Display', price: '325', was: '1399' },
  { id: 'p3', img: '/pab-ugreen.png', fit: 'cover', title: '60W USB Type C Cable Nylon Braided USB C to USB C 2.0 Cable (C to C) Compatible For iPhone', price: '35', was: '1399' },
  { id: 'p4', img: '/pab-wallcharger.jpg', fit: 'contain', title: 'Anker 96W USB-C Wall Charger with 2m Charge Cable, GaN Fast Charging for MacBook & iPhone', price: '129', was: '299', noAd: true },
  { id: 'p5', img: '/pab-usbc-cable.jpg', fit: 'cover', title: 'Anker 100W USB-C to USB-C Fast Charging Cable, 2m Braided Nylon Cord', price: '29', was: '79', noAd: true },
]

function CartSheet({ open, onClose, onCheckout, qty, setQty }) {
  const setItemQty = (id, delta) =>
    setQty((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta)
      return { ...prev, [id]: next }
    })

  return (
    <div
      className={`cart-overlay${open ? ' open' : ''}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        className="cart-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-head">
          <h3>People also bought this</h3>
          <button className="cart-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>

        <div className="cart-rail">
          {PAB_PRODUCTS.map((p) => (
            <PabCard key={p.id} p={p} qty={qty[p.id] || 0} onChange={(d) => setItemQty(p.id, d)} />
          ))}
        </div>

        <div className="cart-footer">
          <button className="cta add-cart cart-checkout" onClick={onCheckout}>Continue to checkout</button>
        </div>
      </div>
    </div>
  )
}

const TRASH_D = 'M7.31152 0.0625H10.1885C11.4235 0.0625 12.4965 0.900296 12.7959 2.09863L13.2754 4.01758L13.2871 4.06543H16.6553C16.6879 4.06418 16.719 4.0625 16.75 4.0625C17.1292 4.0625 17.4375 4.37174 17.4375 4.75098L17.4238 4.88965C17.3597 5.20275 17.0819 5.43848 16.75 5.43848H16.6992C15.9997 5.46604 15.4375 6.04265 15.4375 6.74902V15.749C15.4374 17.7819 13.7829 19.4365 11.75 19.4365H5.75C3.71711 19.4365 2.06265 17.7819 2.0625 15.749V6.74902C2.0625 6.04265 1.50025 5.46604 0.800781 5.43848H0.75C0.370768 5.43848 0.0625 5.13021 0.0625 4.75098V4.75C0.0625 4.37077 0.370768 4.0625 0.75 4.0625C0.76471 4.0625 0.779625 4.06285 0.795898 4.06348C0.811947 4.06409 0.830003 4.06543 0.847656 4.06543H4.21289L4.22461 4.01758L4.7041 2.09863C4.98477 0.973956 5.94536 0.168466 7.08203 0.0722656L7.31152 0.0625ZM3.14453 5.53125C3.33134 5.89768 3.4375 6.31161 3.4375 6.75V15.75C3.4375 17.0258 4.47423 18.0625 5.75 18.0625H11.75C13.0245 18.0625 14.0625 17.0258 14.0625 15.75V6.8125H14.0635V6.75C14.0635 6.31166 14.1697 5.89765 14.3564 5.53125L14.4033 5.44043H3.09766L3.14453 5.53125ZM6.75 8.0625C7.12923 8.0625 7.4375 8.37077 7.4375 8.75V14.75C7.4375 15.1292 7.12923 15.4375 6.75 15.4375C6.37077 15.4375 6.0625 15.1292 6.0625 14.75V8.75C6.0625 8.37077 6.37077 8.0625 6.75 8.0625ZM10.75 8.0625C11.1292 8.0625 11.4375 8.37077 11.4375 8.75V14.75C11.4375 15.1292 11.1292 15.4375 10.75 15.4375C10.3708 15.4375 10.0625 15.1292 10.0625 14.75V8.75C10.0625 8.37077 10.3708 8.0625 10.75 8.0625ZM7.31152 1.4375C6.70782 1.4375 6.18377 1.84726 6.03809 2.43262L5.62988 4.06543H11.8701L11.4619 2.43262C11.3162 1.84726 10.7922 1.4375 10.1885 1.4375H7.31152Z'

function PabCard({ p, qty, onChange }) {
  return (
    <div className="pab-card">
      <div className="pab-img">
        <img className="pab-photo" src={p.img} alt={p.title} style={{ objectFit: p.fit }} />
        <button className="pab-wish" aria-label="Wishlist">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path fill="#fff" stroke="#475067" strokeLinecap="round" strokeLinejoin="round" d="M14 6C14 4.34315 12.6009 3 10.875 3C9.58459 3 8.47685 3.75085 8 4.82228C7.52315 3.75085 6.41541 3 5.125 3C3.39911 3 2 4.34315 2 6C2 10.8137 8 14 8 14C8 14 14 10.8137 14 6Z"/></svg>
        </button>
        {!p.noAd && <span className="pab-ad">Ad</span>}
        <div className="pab-dots"><span /><span className="on" /><span /><span /></div>
        {qty === 0 ? (
          <button className="pab-atc" aria-label="Add to cart" onClick={() => onChange(1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="#101628" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5M19.5 12L4.5 12"/></svg>
          </button>
        ) : (
          <div className="pab-stepper" onClick={(e) => e.stopPropagation()}>
            <button aria-label={qty === 1 ? 'Remove' : 'Decrease'} onClick={() => onChange(-1)}>
              {qty === 1 ? (
                <svg width="17.5" height="19.5" viewBox="0 0 17.5 19.4987" aria-hidden><path fill="#fff" stroke="#fff" strokeWidth="0.125" d={TRASH_D}/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19.5 12L4.5 12"/></svg>
              )}
            </button>
            <span>{qty}</span>
            <button aria-label="Increase" onClick={() => onChange(1)}>
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5M19.5 12L4.5 12"/></svg>
            </button>
          </div>
        )}
      </div>
      <div className="pab-body">
        <div className="pab-title">{p.title}</div>
        <div className="pab-price">
          <span className="pab-now"><Dh />{p.price}</span>
          <span className="pab-was"><Dh />{p.was}</span>
        </div>
        <img className="pab-eta-img" src="/icons/express-today.svg" alt="express Today" width="122" height="18" />
      </div>
    </div>
  )
}

/* --------------------------------- Checkout -------------------------------- */
const CHECKOUT_ITEMS = [
  {
    id: 'c1', img: '/anker-charger.png', fit: 'contain',
    title: 'USB C Plug, 735 Charger (Nano II 65W), PPS 3-Port Fast Compact USB C Charger for MacBook Pro/Air, iPad Pro',
    now: '109', was: '209', off: '47% OFF', date: '7th Sep, Saturday',
  },
  {
    id: 'c2', img: '/pab-powerbank.png', fit: 'cover',
    title: 'Anker magnetic power bank for easy and fast charging',
    now: '160', was: '302', off: '47% OFF', date: '7th Sep, Saturday',
  },
]

function Checkout({ onBack, cartQty = {} }) {
  // The PDP product is always in the cart; anything added from the bottom
  // sheet (qty > 0) is reflected here as its own line item.
  const addedItems = PAB_PRODUCTS
    .filter((p) => (cartQty[p.id] || 0) > 0)
    .map((p) => ({
      id: p.id, img: p.img, fit: p.fit, title: p.title,
      now: p.price, was: p.was,
      off: `${Math.round((1 - Number(p.price) / Number(p.was)) * 100)}% OFF`,
      date: '7th Sep, Saturday',
    }))
  const [items, setItems] = useState(() => [CHECKOUT_ITEMS[0], ...addedItems])
  const [qtys, setQtys] = useState(() => {
    const init = { [CHECKOUT_ITEMS[0].id]: 1 }
    addedItems.forEach((it) => { init[it.id] = cartQty[it.id] || 1 })
    return init
  })
  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id))
  const step = (id, d) => {
    // Stepping below 1 removes the line item from the cart.
    if (d < 0 && (qtys[id] || 1) <= 1) { removeItem(id); return }
    setQtys((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) + d) }))
  }

  return (
    <div className="co">
      <div className="co-top">
        <div className="statusbar">
          <span className="sb-time">9:41</span>
          <span className="sb-right">
            <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden><g fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></g></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden fill="currentColor"><path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM8 5c1.7 0 3.3.7 4.5 1.8l-1.4 1.4A4.4 4.4 0 0 0 8 7c-1.2 0-2.3.5-3.1 1.2L3.5 6.8A6.4 6.4 0 0 1 8 5zm0-4c2.8 0 5.4 1.1 7.3 3l-1.4 1.4A8.4 8.4 0 0 0 8 3 8.4 8.4 0 0 0 2.1 5.4L.7 4A10.4 10.4 0 0 1 8 1z"/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4"/></svg>
          </span>
        </div>
        <div className="co-head">
          <button className="co-back" onClick={onBack} aria-label="Back">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="co-addr">
            <span className="co-addr-line">Home <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg></span>
            <span className="co-addr-sub">Villa 62, Springville, X, VGP Layout, Mhada Col&hellip;</span>
          </div>
          <button className="co-wish" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.6 12 20 12 20z"/></svg>
          </button>
        </div>
      </div>

      <div className="co-scroll">
        <img className="co-express-header" src="/express-header.png" alt="express" />
        <div className="co-express-card">
          {items.map((it) => (
            <div className="co-item" key={it.id}>
              <div className="co-item-imgcol">
                <div className="co-item-img">
                  <img src={it.img} alt={it.title} style={{ objectFit: it.fit }} />
                </div>
                <div className="co-item-step">
                  <button aria-label={qtys[it.id] === 1 ? 'Remove' : 'Decrease'} onClick={() => step(it.id, -1)}>
                    {qtys[it.id] === 1 ? (
                      <svg width="15" height="16" viewBox="0 0 17.5 19.4987" aria-hidden><path fill="currentColor" d={TRASH_D}/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M5 12h14"/></svg>
                    )}
                  </button>
                  <span>{qtys[it.id]}</span>
                  <button aria-label="Increase" onClick={() => step(it.id, 1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>
              </div>
              <div className="co-item-main">
                <div className="co-item-primary">
                  <div className="co-item-title">{it.title}</div>
                  <button className="co-item-wish" aria-label="Wishlist">
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path fill="none" stroke="#475067" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M14 6C14 4.34315 12.6009 3 10.875 3C9.58459 3 8.47685 3.75085 8 4.82228C7.52315 3.75085 6.41541 3 5.125 3C3.39911 3 2 4.34315 2 6C2 10.8137 8 14 8 14C8 14 14 10.8137 14 6Z"/></svg>
                  </button>
                </div>
                <div className="co-item-secondary">
                  <div className="co-item-price">
                    <span className="co-now"><Dh />{it.now}</span>
                    <span className="co-was"><Dh />{it.was}</span>
                    <span className="co-off">{it.off}</span>
                  </div>
                  <div className="co-item-eta">Get by <b>{it.date}</b></div>
                </div>
                <div className="co-item-tertiary">
                  <div className="co-item-point">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path stroke="currentColor" strokeWidth="1.8" d="M3 10h18"/></svg>
                    Prepaid only
                  </div>
                  <div className="co-item-point">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6.5 14l2 2 4-4"/></svg>
                    Faster Delivery at checkout
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="co-one">
            <span className="co-one-pill">one</span>
            <span>Save with noon One. Try it now for <b>Free</b></span>
            <Chev className="row-chev" />
          </div>
        </div>

        <div className="co-card co-coupon">
          <div className="co-coupon-head">Got a coupon?</div>
          <div className="co-coupon-input">
            <input placeholder="Enter your coupon code here" />
            <button>APPLY</button>
          </div>
          <div className="co-coupon-div" />
          <button className="co-coupon-all">
            <span className="co-coupon-ico"><CouponIcon /></span>
            <span>View all coupons &amp; offers</span>
            <Chev className="row-chev" />
          </button>
        </div>

        <div className="co-card co-savings">
          <h3 className="section-h">Savings &amp; benefits</h3>
          <div className="co-inst-wrap">
            <div className="co-inst-row">
              <div className="co-inst">
                <div className="co-inst-top">
                  <img className="co-inst-logo" src="/icons/save-tabby.png" alt="tabby" />
                  <Chev className="co-inst-chev" />
                </div>
                <div className="co-inst-det">
                  <span className="co-inst-amt"><Dh />375 &times; 4</span>
                  <span className="co-inst-sub">0% Installments</span>
                </div>
              </div>
              <div className="co-inst">
                <div className="co-inst-top">
                  <img className="co-inst-logo" src="/icons/save-tamara.png" alt="tamara" />
                  <Chev className="co-inst-chev" />
                </div>
                <div className="co-inst-det">
                  <span className="co-inst-amt"><Dh />375 &times; 4</span>
                  <span className="co-inst-sub">0% Installments</span>
                </div>
              </div>
              <div className="co-inst">
                <div className="co-inst-top">
                  <img className="co-inst-logo" src="/icons/save-bank.png" alt="Bank Installments" />
                  <Chev className="co-inst-chev" />
                </div>
                <div className="co-inst-det">
                  <span className="co-inst-amt co-inst-bank-lbl">Bank<br />Installments</span>
                </div>
              </div>
            </div>
            <div className="co-cashback-list">
              {['/icons/save-noon-yellow.png', '/icons/save-noon-dark.png'].map((src) => (
                <div className="co-cashback" key={src}>
                  <img className="co-cc-card" src={src} alt="noon One credit card" />
                  <span className="co-cashback-txt">Earn <b><Dh />105 cashback</b> with the noon One credit card.</span>
                  <button className="co-cashback-apply">Apply <Chev className="co-inst-chev" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="co-footer">
        <div className="co-saved-banner">
          <img className="co-saved-wave" src="/icons/save-wave.svg" alt="" />
          <div className="co-saved-label">
            <span className="co-saved-txt"><b><Dh />130</b> saved!</span>
            <img className="co-saved-one" src="/icons/save-one.png" alt="noon One" />
          </div>
        </div>
        <div className="co-footer-bar">
          <div className="co-total">
            <span className="co-total-label">Total</span>
            <span className="co-total-val"><Dh /> 1,760.00</span>
          </div>
          <button className="co-checkout-btn">Checkout</button>
        </div>
      </div>

      <div className="co-tabs">
        {[
          { l: 'Home', d: 'M3 11 12 4l9 7M5 10v9h14v-9', on: true },
          { l: 'Categories', d: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
          { l: 'Deals', d: 'M3 11V4h7l10 10-7 7L3 11z' },
          { l: 'Account', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6' },
          { l: 'Cart', d: 'M6 6h15l-1.5 9h-12zM6 6 5 3H2m4 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' },
        ].map((t) => (
          <button className={`co-tab${t.on ? ' on' : ''}`} key={t.l}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d={t.d}/></svg>
            <span>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- Status bar + header ----------------------------- */
function StatusBar() {
  return (
    <div className="pdp-topbar">
      <div className="pdp-nav">
        <button className="navbtn" aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="nav-actions">
          <button className="navbtn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.9"/><path stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" d="m20 20-3.5-3.5"/></svg>
          </button>
          <button className="navbtn" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="1.9" d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.6 12 20 12 20z"/></svg>
          </button>
          <button className="navbtn" aria-label="Share">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Gallery --------------------------------- */
function Gallery() {
  return (
    <div className="gallery">
      <img className="gallery-img" src="/anker-charger.png" alt="Anker 737 GaN USB-C charger" />
      <div className="gallery-dots">
        <span className="dot on" /><span className="dot" /><span className="dot" />
      </div>
    </div>
  )
}

/* -------------------------------- Main info -------------------------------- */
function InfoDot() {
  return <svg width="15" height="15" viewBox="0 0 24 24" className="i-info" aria-hidden><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7"/><path fill="currentColor" d="M11 10h2v7h-2zm0-4h2v2h-2z"/></svg>
}

function MainInfo() {
  return (
    <section className="main-info">
      <div className="store-row">
        <span className="store-name">
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden className="i-verified"><path fill="currentColor" d="m12 2 2.4 1.8 3 .1 1 2.8 2.4 1.8-1 2.8 1 2.8-2.4 1.8-1 2.8-3 .1L12 22l-2.4-1.8-3-.1-1-2.8L3.2 15.5l1-2.8-1-2.8 2.4-1.8 1-2.8 3-.1L12 2Z"/><path fill="#fff" d="m10.6 14.6-2-2-1.2 1.2 3.2 3.2 5.8-5.8-1.2-1.2z"/></svg>
          Anker
        </span>
        <button className="store-visit">Visit Store <Chev /></button>
      </div>

      <div className="mi-card">
      <button className="pdp-title">
        <span>USB C Plug, 735 Charger (Nano II 65W), PPS 3-Port Fast Compact USB C Charge&hellip;</span>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="title-chev"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg>
      </button>

      <div className="rating-row">
        <span className="rating">
          <span className="rstar">★</span> 4.3 <span className="rmuted">(126 reviews)</span>
        </span>
        <span className="tag-prepaid">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path stroke="currentColor" strokeWidth="1.8" d="M3 10h18"/></svg>
          Prepaid Only
        </span>
      </div>

      <div className="price-row">
        <span className="price-now"><Dh />109</span>
        <span className="price-was"><Dh />209</span>
        <span className="price-off">47% OFF</span>
        <span className="price-vat">(incl. of VAT)</span>
        <InfoDot />
      </div>

      <div className="combo-row">
        <img className="combo-ico" src="/icons/combo-icon.gif" alt="" width="20" height="20" />
        <span className="combo-txt">Saving <Dh />45 with Combo</span>
        <InfoDot />
      </div>

      <div className="unit-row">
        <span>500ml</span>
        <span className="unit-div" />
        <span><Dh />2.35/ml</span>
      </div>

      <div className="coupons">
        <span className="coupon">
          <CouponIcon /> Extra 15%, CODE: ENDD15
        </span>
        <span className="coupon">
          <CouponIcon /> Extra 10% o
        </span>
      </div>

      <button className="bestseller">
        <span className="bs-medal">
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.7"/><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="m9 14-2 7 5-3 5 3-2-7"/></svg>
        </span>
        <span>Bestseller <b>#1</b> in <a>Chargers</a></span>
        <Chev className="row-chev" />
      </button>
      </div>
    </section>
  )
}

function CouponIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="i-coupon">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="m8 16 8-8"/>
      <circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/>
    </svg>
  )
}

/* --------------------------------- Delivery -------------------------------- */
function Delivery() {
  return (
    <section className="card delivery">
      <div className="delivery-head">
        <h3>Delivery Information</h3>
        <span className="one-badge"><span className="one-pill">one</span> member</span>
      </div>
      <div className="delivery-express">
        <span className="express-pill">express</span>
        <span>Get it <b>Tomorrow before 12 PM</b></span>
      </div>
      <button className="row-item other-delivery">
        <span>Other Delivery Options</span>
        <Chev className="row-chev down" />
      </button>
    </section>
  )
}

/* ------------------------------- Trustmarkers ------------------------------ */
function Trustmarkers() {
  const items = [
    { label: 'High\nRated', icon: '/icons/trust-return.svg' },
    { label: 'Low & Easy\nReturns', icon: '/icons/trust-verified.svg' },
    { label: 'Secure\nTransactions', icon: '/icons/trust-support.svg' },
  ]
  return (
    <section className="card trust-row">
      {items.map((it) => (
        <div className="trust-col" key={it.label}>
          <img className="trust-ico" src={it.icon} alt="" width="20" height="20" />
          <span className="trust-label">{it.label.split('\n').map((l, i) => <span key={i}>{l}</span>)}</span>
        </div>
      ))}
    </section>
  )
}

/* ----------------------------- Product details ----------------------------- */
function ProductDetails() {
  const rows = ['Overview', 'Highlights', 'Specifications']
  const [open, setOpen] = useState(null)
  return (
    <section className="card details">
      <h3 className="section-h">Product Details</h3>
      {rows.map((r) => (
        <div className="accordion" key={r}>
          <button className="accordion-head" onClick={() => setOpen(open === r ? null : r)}>
            <span>{r}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={`acc-chev${open === r ? ' open' : ''}`}><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg>
          </button>
          <AnimatePresence initial={false}>
            {open === r && (
              <motion.div className="accordion-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={MOTION}>
                <p>Compact 3-port GaN charger delivering up to 65W with PPS fast charging. Charge a MacBook Air, iPhone and AirPods simultaneously.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </section>
  )
}

/* --------------------------- Additional information -------------------------- */
function AdditionalInfo() {
  const rows = [
    { label: 'Not eligible for returns', icon: <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M3 8l4-4h10l4 4v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 8h18M9 12h6"/> },
    { label: 'Free delivery with Lockers & Pickup', icon: <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M5 4h14v16H5zM9 4v6l3-2 3 2V4"/> },
    { label: '1 year warranty applicable', icon: <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.4-3 8.3-7 9.5C8 19.3 5 15.4 5 11V6zM9.5 12l1.8 1.8L15 10"/> },
  ]
  return (
    <section className="card add-info">
      <h3 className="section-h">Additional Information</h3>
      {rows.map((r) => (
        <button className="row-item info-row" key={r.label}>
          <span className="info-ico">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>{r.icon}</svg>
          </span>
          <span className="info-label">{r.label}</span>
          <Chev className="row-chev" />
        </button>
      ))}
    </section>
  )
}

/* ------------------------------- Seller widget ------------------------------ */
function SellerWidget() {
  const chips = ['Low Return Seller', 'Great Recent Ratings', 'Partner Since 5+ Years', 'Item as Described 100%']
  return (
    <section className="card seller">
      <div className="seller-head">
        <span className="seller-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden fill="currentColor"><path d="M16.4 12.6c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.5 2 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.7-1 2.4-2c.7-1.1 1-2.1 1-2.2 0 0-1.9-.7-1.9-2.9zM14.5 6.4c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.9 0 1.8-.5 2.3-1.1z"/></svg>
        </span>
        <div className="seller-meta">
          <button className="seller-name">Sold by <b>Anker UAE Inc.</b> <Chev /></button>
          <div className="seller-rating">
            <span className="rstar">★</span> 4.3 <span className="rmuted">(128)</span>
            <span className="seller-pos"><b>74% Positive</b> Seller Ratings</span>
          </div>
        </div>
      </div>

      <div className="seller-chips">
        {chips.map((c) => (
          <span className="seller-chip" key={c}>
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.6 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/></svg>
            {c === 'Item as Described 100%'
              ? <span>Item as Described <b className="emerald">100%</b></span>
              : <span>{c}</span>}
          </span>
        ))}
      </div>

      <button className="seller-offers">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="i-tag"><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M3 11V4h7l10 10-7 7L3 11z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/></svg>
        <span>5 offers from other sellers from <span className="offers-price"><Dh />649</span></span>
        <Chev className="row-chev" />
      </button>
    </section>
  )
}

/* --------------------------------- helpers --------------------------------- */
function Chev({ className = '' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className={`chev ${className}`}>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6"/>
    </svg>
  )
}
