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
  const [showPrice, setShowPrice] = useState(false)
  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id))
  const step = (id, d) => {
    // Stepping below 1 removes the line item from the cart.
    if (d < 0 && (qtys[id] || 1) <= 1) { removeItem(id); return }
    setQtys((p) => ({ ...p, [id]: Math.max(1, (p[id] || 1) + d) }))
  }

  // Pricing is derived from the products currently in the cart.
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtInt = (n) => Math.round(n).toLocaleString('en-US')
  const totalWas = items.reduce((s, it) => s + Number(it.was) * (qtys[it.id] || 1), 0)
  const totalNow = items.reduce((s, it) => s + Number(it.now) * (qtys[it.id] || 1), 0)
  const itemCount = items.reduce((s, it) => s + (qtys[it.id] || 1), 0)

  // Price-breakup line items — single source of truth shared with the PriceSheet.
  const breakup = { deliveryFee: 7, couponDiscount: 7, couponCashback: 30, cardCashback: 45 }
  // "saved" banner = the discount off MRP (subtotal was → now) plus the coupon
  // discount line from the breakup. Cashback is a reward credited later, not a
  // price reduction, so it's excluded — this keeps the saved amount below the
  // total you actually pay.
  const savings = (totalWas - totalNow) + breakup.couponDiscount

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
        {!showPrice && (
          <div className="co-saved-banner">
            <img className="co-saved-wave" src="/icons/save-wave.svg" alt="" />
            <div className="co-saved-label">
              <span className="co-saved-txt"><b><Dh />{fmtInt(savings)}</b> saved!</span>
              <img className="co-saved-one" src="/icons/save-one.png" alt="noon One" />
            </div>
          </div>
        )}
        <div className="co-footer-bar">
          <button className="co-total" onClick={() => setShowPrice(true)} aria-label="View price breakdown">
            <span className="co-total-label">Total</span>
            <span className="co-total-val"><Dh /> {fmt(totalNow)}</span>
          </button>
          <button className="co-checkout-btn">Checkout</button>
        </div>
      </div>

      {showPrice && (
        <PriceSheet
          onClose={() => setShowPrice(false)}
          fmt={fmt}
          itemCount={itemCount}
          totalWas={totalWas}
          totalNow={totalNow}
          savings={savings}
          breakup={breakup}
        />
      )}

      <div className="co-tabs">
        {[
          { l: 'Home', icon: 'home' },
          { l: 'Categories', icon: 'cats' },
          { l: 'Deals', icon: 'deals' },
          { l: 'Account', icon: 'account' },
          { l: 'Cart', icon: 'cart', on: true, badge: '2' },
        ].map((t) => (
          <button className={`co-tab${t.on ? ' on' : ''}`} key={t.l}>
            {t.on && <span className="co-tab-ind" />}
            <span className="co-tab-ico">
              <TabIcon name={t.icon} />
              {t.badge && <span className="co-tab-badge">{t.badge}</span>}
            </span>
            <span>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------- Checkout price-breakup sheet ------------------------ */
function PriceSheet({ onClose, fmt, itemCount, totalWas, totalNow, savings, breakup }) {
  return (
    <div className="ps-overlay" onClick={onClose}>
      <div className="ps-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="ps-head">
          <h3 className="ps-title">Payment summary</h3>
          <span className="ps-count">{itemCount} items</span>
        </div>

        <div className="ps-rows">
          <div className="ps-row">
            <span className="ps-lbl">Subtotal</span>
            <span className="ps-vals">
              <span className="ps-was"><Dh />{fmt(totalWas)}</span>
              <span className="ps-now"><Dh />{fmt(totalNow)}</span>
            </span>
          </div>
          <div className="ps-row">
            <span className="ps-lbl">Delivery Fee</span>
            <span className="ps-vals">
              <span className="ps-free">Free with <img className="ps-one" src="/icons/save-one.png" alt="noon One" /></span>
              <span className="ps-was"><Dh />{fmt(breakup.deliveryFee)}</span>
            </span>
          </div>
          <div className="ps-div" />
          <div className="ps-row">
            <span className="ps-lbl">Coupon Discount</span>
            <span className="ps-now ps-neg">&minus; <Dh />{fmt(breakup.couponDiscount)}</span>
          </div>
        </div>

        <div className="ps-mint">
          <div className="ps-row">
            <span className="ps-lbl">Coupon Cashback</span>
            <span className="ps-now"><Dh />{breakup.couponCashback}</span>
          </div>
          <div className="ps-row">
            <span className="ps-lbl">noon one credit card</span>
            <span className="ps-now"><Dh />{breakup.cardCashback}</span>
          </div>
          <p className="ps-note">cashback will be credited to the primary cardholder's account</p>
        </div>
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

/* ------------------------------ Bottom-nav icons ----------------------------- */
/* Geometry extracted 1:1 from Figma node 10488-24665. currentColor = tab tint;
   #fff = duotone cut-outs. */
function TabIcon({ name }) {
  switch (name) {
    case 'home':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" d="M24.0002 26.6682H20.0002V18.6665C20.0002 17.1932 18.8069 15.9998 17.3335 15.9998H14.6719C13.1969 15.9998 12.0035 17.1965 12.0052 18.6715L12.0185 26.6698H8.00019C7.26352 26.6698 6.66685 26.0732 6.66685 25.3365V13.3348H25.3335V25.3365C25.3335 26.0732 24.7369 26.6698 24.0002 26.6698V26.6682Z"/>
          <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" d="M25.3331 12.2019V6.66685H23.9998V12.2019H25.3331Z"/>
          <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" d="M16.8883 5.33315H15.11C14.8217 5.33315 14.54 5.42648 14.31 5.59981L3.99833 13.3331V14.6665H27.9983V13.3331L17.6867 5.59981C17.4567 5.42648 17.175 5.33315 16.8867 5.33315H16.8883Z"/>
        </svg>
      )
    case 'cats':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path fill="#fff" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.6583 25.86C10.9717 26.0466 9.27 26.0466 7.58333 25.86C6.88833 25.7833 6.33833 25.2333 6.26166 24.5383C6.075 22.8516 6.075 21.15 6.26166 19.4633C6.33833 18.7683 6.88833 18.2183 7.58333 18.1416C9.27 17.955 10.9717 17.955 12.6583 18.1416C13.3533 18.2183 13.9033 18.7683 13.98 19.4633C14.1667 21.15 14.1667 22.8516 13.98 24.5383C13.9033 25.2333 13.3533 25.7833 12.6583 25.86Z"/>
          <path fill="#fff" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M24.4166 25.86C22.73 26.0466 21.0283 26.0466 19.3416 25.86C18.6466 25.7833 18.0966 25.2333 18.02 24.5383C17.8333 22.8516 17.8333 21.15 18.02 19.4633C18.0966 18.7683 18.6466 18.2183 19.3416 18.1416C21.0283 17.955 22.73 17.955 24.4166 18.1416C25.1116 18.2183 25.6616 18.7683 25.7383 19.4633C25.925 21.15 25.925 22.8516 25.7383 24.5383C25.6616 25.2333 25.1116 25.7833 24.4166 25.86Z"/>
          <path fill="#fff" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M18.02 12.78C17.8333 11.0933 17.8333 9.39166 18.02 7.70499C18.0966 7.00999 18.6466 6.45999 19.3416 6.38333C21.0283 6.19666 22.73 6.19666 24.4166 6.38333C25.1116 6.45999 25.6616 7.00999 25.7383 7.70499C25.925 9.39166 25.925 11.0933 25.7383 12.78C25.6616 13.475 25.1116 14.025 24.4166 14.1017C22.73 14.2883 21.0283 14.2883 19.3416 14.1017C18.6466 14.025 18.0966 13.475 18.02 12.78Z"/>
          <path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9.33333 4L9.62833 4.79667C10.355 6.76167 11.905 8.31167 13.87 9.03833L14.6667 9.33333L13.87 9.62833C11.905 10.355 10.355 11.905 9.62833 13.87L9.33333 14.6667L9.03833 13.87C8.31167 11.905 6.76167 10.355 4.79667 9.62833L4 9.33333L4.79667 9.03833C6.76167 8.31167 8.31167 6.76167 9.03833 4.79667L9.33333 4Z"/>
        </svg>
      )
    case 'deals':
      return (
        <svg width="32" height="32" viewBox="13.75 0 32 32" fill="none" aria-hidden>
          <path fill="#fff" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M41.1667 10.6667L38.5 8H26.5V26.6683H38.265C40.545 26.6683 42.3383 24.72 42.15 22.4467L41.1683 10.6667H41.1667Z"/>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M35.8346 11.9993V5.99935C35.8346 4.15768 34.343 2.66602 32.5013 2.66602C30.6596 2.66602 29.168 4.15768 29.168 5.99935V10.666"/>
          <path fill="#fff" stroke="#fff" strokeWidth="1.33333" strokeLinejoin="round" d="M29.8346 16.6673C30.2028 16.6673 30.5013 16.3688 30.5013 16.0007C30.5013 15.6325 30.2028 15.334 29.8346 15.334C29.4664 15.334 29.168 15.6325 29.168 16.0007C29.168 16.3688 29.4664 16.6673 29.8346 16.6673Z"/>
          <path fill="#fff" stroke="currentColor" strokeLinejoin="round" d="M29.1654 16V10.6667C29.1654 9.19333 27.972 8 26.4987 8C25.0254 8 23.832 9.19333 23.832 10.6667V16"/>
          <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" d="M31.8741 26.669H21.1274C19.5441 26.669 18.3108 25.2973 18.4758 23.724L19.4408 14.5273C19.5124 13.849 20.0841 13.334 20.7674 13.334H32.2341C32.9158 13.334 33.4891 13.849 33.5608 14.5273L34.5258 23.724C34.6908 25.299 33.4574 26.669 31.8741 26.669Z"/>
          <path fill="#fff" d="M28.9141 23.0801C29.4663 23.0801 29.9141 22.6324 29.9141 22.0801C29.9141 21.5278 29.4663 21.0801 28.9141 21.0801C28.3618 21.0801 27.9141 21.5278 27.9141 22.0801C27.9141 22.6324 28.3618 23.0801 28.9141 23.0801Z"/>
          <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M29.1654 17.002L23.832 22.3353"/>
          <path fill="#fff" d="M24.0859 18.2549C24.6382 18.2549 25.0859 17.8072 25.0859 17.2549C25.0859 16.7026 24.6382 16.2549 24.0859 16.2549C23.5337 16.2549 23.0859 16.7026 23.0859 17.2549C23.0859 17.8072 23.5337 18.2549 24.0859 18.2549Z"/>
        </svg>
      )
    case 'account':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" d="M11.2067 20.96L8.79004 23.86C10.6884 25.6033 13.22 26.6667 16 26.6667C18.78 26.6667 21.3167 25.6 23.2167 23.8533L20.805 20.96C20.2984 20.3517 19.5484 20 18.7567 20H13.255C12.4634 20 11.7134 20.3517 11.2067 20.96Z"/>
          <path stroke="currentColor" strokeLinejoin="round" d="M16 26.6667C21.891 26.6667 26.6667 21.891 26.6667 16C26.6667 10.109 21.891 5.33333 16 5.33333C10.109 5.33333 5.33333 10.109 5.33333 16C5.33333 21.891 10.109 26.6667 16 26.6667Z"/>
          <path fill="currentColor" d="M16.0067 17.3333C18.2158 17.3333 20.0067 15.5425 20.0067 13.3333C20.0067 11.1242 18.2158 9.33333 16.0067 9.33333C13.7975 9.33333 12.0067 11.1242 12.0067 13.3333C12.0067 15.5425 13.7975 17.3333 16.0067 17.3333Z"/>
        </svg>
      )
    case 'cart':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <g transform="translate(8.83 7.5)"><path fill="currentColor" stroke="currentColor" strokeLinejoin="round" d="M10.5467 11.1667H3.01C2.33834 11.1667 1.77 10.6667 1.68667 9.99833L0.500003 0.5H17.2433C18.175 0.5 18.8183 1.43 18.4917 2.30167L16.79 6.84167C15.815 9.44333 13.3267 11.1683 10.5483 11.1683L10.5467 11.1667Z"/></g>
          <g transform="translate(8.83 18.17)"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M10.915 0.5H1.83333C1.09667 0.5 0.5 1.09667 0.5 1.83333C0.5 3.30667 1.69333 4.5 3.16667 4.5H15.1667"/></g>
          <g transform="translate(3.5 4.83)"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M0.5 0.5H4.32333C4.995 0.5 5.56333 1 5.64667 1.66833L6.435 7.98"/></g>
          <g transform="translate(10.67 24)"><path fill="currentColor" d="M2 4C3.10457 4 4 3.10457 4 2C4 0.895431 3.10457 0 2 0C0.895431 0 0 0.895431 0 2C0 3.10457 0.895431 4 2 4Z"/></g>
          <g transform="translate(20 24)"><path fill="currentColor" d="M2 4C3.10457 4 4 3.10457 4 2C4 0.895431 3.10457 0 2 0C0.895431 0 0 0.895431 0 2C0 3.10457 0.895431 4 2 4Z"/></g>
          <g transform="translate(12.83 10.17)"><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M0.5 0.5V5.83333"/></g>
          <g transform="translate(16.83 10.17)"><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M0.5 0.5V5.83333"/></g>
          <g transform="translate(20.83 10.17)"><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M0.5 0.5V5.83333"/></g>
        </svg>
      )
    default:
      return null
  }
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
