import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
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

  // Scroll-linked gallery: the product image shrinks as the page scrolls,
  // so the content sliding over the pinned gallery feels more interactive.
  const scrollRef = useRef(null)
  const { scrollY } = useScroll({ container: scrollRef })
  const imgScale = useTransform(scrollY, [0, 320], [1, 0.7], { clamp: true })
  const imgOpacity = useTransform(scrollY, [0, 260, 400], [1, 1, 0.35], { clamp: true })

  if (view === 'checkout')
    return <Checkout onBack={() => setView('pdp')} onProceed={() => setView('payment')} cartQty={cartQty} />
  if (view === 'payment')
    return <PaymentCheckout onBack={() => setView('checkout')} cartQty={cartQty} />

  return (
    <>
      <div className="pdp">
        <StatusBar />
        <div className="pdp-scroll" ref={scrollRef}>
          <Gallery imgScale={imgScale} imgOpacity={imgOpacity} />
          <div className="pdp-sections">
            <MainInfo onBestseller={() => setView('plp')} />
            <Delivery />
            <ProductGlance />
            <PaymentOffers />
            <VariantPicker />
            <Trustmarkers />
            <ProductDetails />
            <AdditionalInfo />
            <SellerWidget />
            <Reviews />
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
      <AnimatePresence>
        {view === 'plp' && <PLP key="plp" onBack={() => setView('pdp')} />}
      </AnimatePresence>
    </>
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
  { id: 'p1', img: '/pab-powerbank.png', fit: 'cover', title: 'Anker magnetic power bank for easy and fast charging', price: '160', was: '453', best: true },
  { id: 'p2', img: '/pab-anker737.png', fit: 'contain', title: 'Anker 737 Power Bank (PowerCore 24K3), 24,000mAh 3-Port Portable Charger with 140W Output, Smart Digital Display', price: '325', was: '1399' },
  { id: 'p3', img: '/pab-ugreen.png', fit: 'cover', title: '60W USB Type C Cable Nylon Braided USB C to USB C 2.0 Cable (C to C) Compatible For iPhone', price: '35', was: '1399' },
  { id: 'p4', img: '/pab-wallcharger.jpg', fit: 'contain', title: 'Anker 96W USB-C Wall Charger with 2m Charge Cable, GaN Fast Charging for MacBook & iPhone', price: '129', was: '299', noAd: true },
  { id: 'p5', img: '/pab-usbc-cable.jpg', fit: 'cover', title: 'Anker 100W USB-C to USB-C Fast Charging Cable, 2m Braided Nylon Cord', price: '29', was: '79', noAd: true },
]

function CartSheet({ open, onClose, onCheckout, qty, setQty }) {
  const [layout, setLayout] = useState('rail')
  const setItemQty = (id, delta) =>
    setQty((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta)
      return { ...prev, [id]: next }
    })

  const isGrid = layout === 'grid'

  return (
    <div
      className={`cart-overlay${open ? ' open' : ''}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div className="cart-toggle-float" role="group" aria-label="Layout" onClick={(e) => e.stopPropagation()}>
        <button
          className={`clt-btn${!isGrid ? ' on' : ''}`}
          onClick={() => setLayout('rail')}
          aria-label="Horizontal layout"
          aria-pressed={!isGrid}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><rect x="1" y="3.5" width="6" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="3.5" width="6" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>
        </button>
        <button
          className={`clt-btn${isGrid ? ' on' : ''}`}
          onClick={() => setLayout('grid')}
          aria-label="Grid layout"
          aria-pressed={isGrid}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><rect x="2" y="2" width="5" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="2" width="5" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.4"/><rect x="2" y="9" width="5" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="5" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>
        </button>
      </div>

      <div
        className={`cart-sheet${isGrid ? ' cart-sheet--tall' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-head">
          <h3>Shop more like this</h3>
          <div className="cart-head-actions">
            <button className="cart-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          </div>
        </div>

        <div className={isGrid ? 'cart-grid' : 'cart-rail'}>
          {PAB_PRODUCTS.map((p, i) => (
            <PabCard key={p.id} p={p} first={i === 0} qty={qty[p.id] || 0} onChange={(d) => setItemQty(p.id, d)} />
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

function PabCard({ p, qty, onChange, first }) {
  const off = p.was ? Math.round((1 - Number(p.price) / Number(p.was)) * 100) : 0
  return (
    <div className="pab-card">
      <div className="pab-img">
        <img className="pab-photo" src={p.img} alt={p.title} />
        <button className="pab-wish" aria-label="Wishlist">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path fill="#fff" stroke="#475067" strokeLinecap="round" strokeLinejoin="round" d="M14 6C14 4.34315 12.6009 3 10.875 3C9.58459 3 8.47685 3.75085 8 4.82228C7.52315 3.75085 6.41541 3 5.125 3C3.39911 3 2 4.34315 2 6C2 10.8137 8 14 8 14C8 14 14 10.8137 14 6Z"/></svg>
        </button>
        {p.best && <span className="pab-best">Best Seller</span>}
        {first && <span className="pab-ad">Ad</span>}
        <div className="pab-dots"><span /><span className="on" /><span /><span /></div>
        {qty === 0 ? (
          <button className="pab-atc" aria-label="Add to cart" onClick={() => onChange(1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="#0076ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5M19.5 12L4.5 12"/></svg>
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
          {off > 0 && <span className="pab-off">{off}%</span>}
        </div>
        <img className="pab-eta-img" src="/icons/express-today.svg" alt="express Today" width="122" height="18" />
      </div>
    </div>
  )
}

/* ---- Inline sponsored offers carousel (checkout page) ---- */
function OffersRow() {
  const [qty, setQty] = useState({})
  const setItemQty = (id, delta) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }))
  return (
    <div className="co-card co-offers">
      <div className="co-offers-head">
        <h3 className="co-offers-title">Don't miss out on these offers</h3>
        <span className="co-offers-ad">Ad</span>
      </div>
      <div className="co-offers-rail">
        {PAB_PRODUCTS.map((p, i) => (
          <OfferCard key={p.id} p={p} first={i === 0} qty={qty[p.id] || 0} onChange={(d) => setItemQty(p.id, d)} />
        ))}
      </div>
    </div>
  )
}

function OfferCard({ p, qty, onChange, first }) {
  const off = p.was ? Math.round((1 - Number(p.price) / Number(p.was)) * 100) : 0
  return (
    <div className="pab-card">
      <div className="pab-img">
        <img className="pab-photo" src={p.img} alt={p.title} />
        <button className="pab-wish" aria-label="Wishlist">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path fill="#fff" stroke="#475067" strokeLinecap="round" strokeLinejoin="round" d="M14 6C14 4.34315 12.6009 3 10.875 3C9.58459 3 8.47685 3.75085 8 4.82228C7.52315 3.75085 6.41541 3 5.125 3C3.39911 3 2 4.34315 2 6C2 10.8137 8 14 8 14C8 14 14 10.8137 14 6Z"/></svg>
        </button>
        {p.best && <span className="pab-best">Best Seller</span>}
        {first && <span className="pab-ad">Ad</span>}
      </div>
      <div className="pab-body">
        <div className="pab-title">{p.title}</div>
        <div className="pab-price">
          <span className="pab-now"><Dh />{p.price}</span>
          <span className="pab-was"><Dh />{p.was}</span>
          {off > 0 && <span className="pab-off">{off}%</span>}
        </div>
        <img className="pab-eta-img" src="/icons/express-today.svg" alt="express Today" width="122" height="18" />
        {qty === 0 ? (
          <button className="pab-add" onClick={() => onChange(1)}>ADD</button>
        ) : (
          <div className="pab-add pab-add-stepper">
            <button aria-label="Decrease" onClick={() => onChange(-1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M5 12h14"/></svg>
            </button>
            <span>{qty}</span>
            <button aria-label="Increase" onClick={() => onChange(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---- "Deals under 30 AED" carousel (checkout page) ---- */
const DEAL_PRODUCTS = [
  { id: 'd1', img: '/pab-usbc-cable.jpg', title: 'Anker USB-C to USB-C Cable, 60W Fast Charging', sub: '1.8 m • White', rating: '4.3', count: '128', now: '25', was: '45', off: '45% off', best: true },
  { id: 'd2', img: '/pab-ugreen.png', title: 'UGREEN USB Type-C Cable Nylon Braided', sub: '1 m • Grey', rating: '4.5', count: '312', now: '27', was: '49', off: '45% off' },
  { id: 'd3', img: '/pab-wallcharger.jpg', title: '20W USB-C Wall Charger Fast Adapter', sub: '20 W', rating: '4.6', count: '876', now: '29', was: '59', off: '51% off', best: true },
  { id: 'd4', img: '/pab-anker737.png', title: 'Anker PowerLine Fast Charging Cable', sub: '0.9 m', rating: '4.2', count: '54', now: '19', was: '39', off: '51% off' },
  { id: 'd5', img: '/pab-powerbank.png', title: 'Mini Magnetic Wireless Charger Pad', sub: '15 W', rating: '4.4', count: '203', now: '28', was: '69', off: '59% off' },
]

function FlashIcon() {
  return <svg className="deal-flash" width="12" height="12" viewBox="0 0 24 24" aria-hidden><path fill="#2122b8" d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z"/></svg>
}
function StarIcon() {
  return <svg className="deal-star" width="12" height="12" viewBox="0 0 24 24" aria-hidden><path fill="#1f7a74" d="M12 2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.8 6.1 20.6l1.3-6.5L2.5 8.9l6.6-.8z"/></svg>
}

function DealsRow() {
  const [qty, setQty] = useState({})
  const setItemQty = (id, delta) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }))
  return (
    <div className="co-card co-offers">
      <div className="co-offers-head">
        <h3 className="co-offers-title">Deals under 30 AED</h3>
        <span className="co-offers-ad">Ad</span>
      </div>
      <div className="co-offers-rail">
        {DEAL_PRODUCTS.map((p, i) => (
          <DealCard key={p.id} p={p} first={i === 0} qty={qty[p.id] || 0} onChange={(d) => setItemQty(p.id, d)} />
        ))}
      </div>
    </div>
  )
}

function DealCard({ p, qty, onChange, first }) {
  return (
    <div className="deal-card">
      <div className="deal-img">
        <img className="deal-photo" src={p.img} alt={p.title} />
        {p.best && <span className="deal-best">Best seller</span>}
        {first && <span className="deal-ad">Ad</span>}
        <button className="deal-wish" aria-label="Wishlist">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path fill="#fff" stroke="#475067" strokeLinecap="round" strokeLinejoin="round" d="M14 6C14 4.34315 12.6009 3 10.875 3C9.58459 3 8.47685 3.75085 8 4.82228C7.52315 3.75085 6.41541 3 5.125 3C3.39911 3 2 4.34315 2 6C2 10.8137 8 14 8 14C8 14 14 10.8137 14 6Z"/></svg>
        </button>
        {qty === 0 ? (
          <button className="pab-atc" aria-label="Add to cart" onClick={() => onChange(1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="#0076ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5M19.5 12L4.5 12"/></svg>
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
      <div className="deal-body">
        <div className="deal-title">{p.title}</div>
        <div className="deal-sub">{p.sub}</div>
        <div className="deal-rating"><StarIcon /><b>{p.rating}</b><span>({p.count})</span></div>
        <div className="deal-div" />
        <div className="deal-price">
          <span className="deal-now"><Dh />{p.now}</span>
          <span className="deal-was"><Dh />{p.was}</span>
          <span className="deal-off">{p.off}</span>
        </div>
        <div className="deal-eta"><FlashIcon />1 HR 15 MINS</div>
      </div>
    </div>
  )
}

/* ------------------ PLP: "Bestseller in Chargers" listing ------------------ */
const PLP_PRODUCTS = [
  { id: 'l1', img: '/pab-usbc-cable.jpg', title: 'Anker USB-C to USB-C Cable, 60W Fast Charging Braided', rating: '4.3', count: '128', now: '25', was: '45', off: '45% off', unit: '1.8 m', unitPrice: '13.9/m', best: true, variantCount: 4, ad: true },
  { id: 'l2', img: '/pab-powerbank.png', title: 'Anker Magnetic Wireless Power Bank 5000mAh MagGo', rating: '4.6', count: '890', now: '160', was: '453', off: '65% off', unit: '5000 mAh', unitPrice: '0.03/mAh', best: true, variantCount: 3 },
  { id: 'l3', img: '/pab-anker737.png', title: 'Anker 737 Power Bank (PowerCore 24K), 140W Output', rating: '4.7', count: '512', now: '325', was: '1399', off: '77% off', unit: '24000 mAh', unitPrice: '0.01/mAh', best: true, variantCount: 2 },
  { id: 'l4', img: '/pab-wallcharger.jpg', title: 'Anker 96W USB-C Wall Charger GaN Fast Adapter', rating: '4.5', count: '204', now: '129', was: '299', off: '57% off', unit: '96 W', unitPrice: '1.34/W', best: true, variantCount: 4 },
  { id: 'l5', img: '/pab-ugreen.png', title: 'UGREEN 60W USB Type-C Cable Nylon Braided 1m', rating: '4.5', count: '312', now: '27', was: '49', off: '45% off', unit: '1 m', unitPrice: '27.0/m', best: true, variantCount: 3 },
  { id: 'l6', img: '/anker-charger.png', title: 'USB C Plug, 735 Charger (Nano II 65W) 3-Port', rating: '4.3', count: '126', now: '109', was: '209', off: '47% off', unit: '65 W', unitPrice: '1.67/W', best: true, variantCount: 4 },
]
const PLP_SWATCHES = ['#f43333', '#05af25', '#0076ff']

function PLP({ onBack }) {
  const [qty, setQty] = useState({})
  const setItemQty = (id, delta) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }))
  const slide = { type: 'tween', ease: [0.22, 0.61, 0.36, 1], duration: 0.3 }
  return (
    <motion.div className="plp" initial={false} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Top bar stays fixed and morphs (search icon → pill); only the
          listing content slides in/out from the right. */}
      <div className="plp-top">
        <TopNav state={2} onBack={onBack} />
      </div>

      <div className="plp-scroll">
        <motion.div
          className="plp-content"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={slide}
        >
          <h1 className="plp-heading">Bestseller in chargers</h1>
          <div className="plp-grid">
            {PLP_PRODUCTS.map((p) => (
              <PlpCard key={p.id} p={p} qty={qty[p.id] || 0} onChange={(d) => setItemQty(p.id, d)} />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="co-tabs">
        {[
          { l: 'Home', icon: 'home', on: true },
          { l: 'Categories', icon: 'cats' },
          { l: 'Deals', icon: 'deals' },
          { l: 'Account', icon: 'account' },
          { l: 'Cart', icon: 'cart', badge: '2' },
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
    </motion.div>
  )
}

function PlpCard({ p, qty, onChange }) {
  return (
    <div className="plp-card">
      <div className="plp-img">
        <img className="plp-photo" src={p.img} alt={p.title} />
        <button className="plp-wish" aria-label="Wishlist">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path fill="#fff" stroke="#475067" strokeLinecap="round" strokeLinejoin="round" d="M14 6C14 4.34315 12.6009 3 10.875 3C9.58459 3 8.47685 3.75085 8 4.82228C7.52315 3.75085 6.41541 3 5.125 3C3.39911 3 2 4.34315 2 6C2 10.8137 8 14 8 14C8 14 14 10.8137 14 6Z"/></svg>
        </button>
        {p.ad && <span className="plp-ad">Ad</span>}
        <div className="plp-dots"><span className="on" /><span /><span /></div>
        {p.variantCount > 1 && (
          <div className="plp-variant">
            <div className="plp-swatches">
              {PLP_SWATCHES.map((c) => <span key={c} style={{ background: c }} />)}
            </div>
            <span className="plp-variant-num">{p.variantCount}</span>
          </div>
        )}
        {qty === 0 ? (
          <button className="plp-atc" aria-label="Add to cart" onClick={() => onChange(1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="#0076ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5M19.5 12L4.5 12"/></svg>
          </button>
        ) : (
          <div className="plp-stepper" onClick={(e) => e.stopPropagation()}>
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
      <div className="plp-body">
        <div className="plp-title">{p.title}</div>
        <div className="plp-rating"><StarIcon /><b>{p.rating}</b><span>({p.count})</span></div>
        <div className="plp-price">
          <span className="plp-now"><Dh />{p.now}</span>
          <span className="plp-was"><Dh />{p.was}</span>
          <span className="plp-off">{p.off}</span>
        </div>
        <div className="plp-unit"><span>{p.unit}</span><span className="plp-unit-div" /><span><Dh />{p.unitPrice}</span></div>
        <div className="plp-coupons">
          <span className="plp-coupon">Extra 10% Off</span>
          <span className="plp-coupon">+3</span>
        </div>
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

function Checkout({ onBack, onProceed, cartQty = {} }) {
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
            <img className="co-one-logo" src="/icons/save-one.png" alt="noon One" />
            <span>Save with noon One. Try it now for <b>Free</b></span>
            <Chev className="row-chev" />
          </div>
        </div>

        <OffersRow />

        <DealsRow />

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

        <PaymentSummary fmt={fmt} totalWas={totalWas} totalNow={totalNow} breakup={breakup} />
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
          <button className="co-checkout-btn" onClick={onProceed}>Checkout</button>
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

/* Inline "Payment summary" breakup card (checkout page, Figma 10517-21053) */
function PaymentSummary({ fmt, totalWas, totalNow, breakup }) {
  const grandTotal = totalNow - breakup.couponDiscount
  return (
    <div className="co-card co-sum">
      <h3 className="co-sum-title">Payment summary</h3>
      <div className="co-sum-rows">
        <div className="co-sum-row">
          <span className="co-sum-lbl co-sum-lbl-dot">Subtotal</span>
          <span className="co-sum-vals">
            <span className="co-sum-was"><Dh />{fmt(totalWas)}</span>
            <span className="co-sum-now"><Dh />{fmt(totalNow)}</span>
          </span>
        </div>
        <div className="co-sum-row">
          <span className="co-sum-lbl co-sum-lbl-dot">Delivery fee</span>
          <span className="co-sum-vals">
            <span className="co-sum-free">Free with <img className="co-sum-one" src="/icons/save-one.png" alt="noon One" /></span>
            <span className="co-sum-was"><Dh />{fmt(breakup.deliveryFee)}</span>
          </span>
        </div>
        <div className="co-sum-div" />
        <div className="co-sum-row">
          <span className="co-sum-lbl">Coupon discount</span>
          <span className="co-sum-now">&minus; <Dh />{fmt(breakup.couponDiscount)}</span>
        </div>
        <div className="co-sum-div" />
        <div className="co-sum-row co-sum-total">
          <span>Total</span>
          <span><Dh />{fmt(grandTotal)}</span>
        </div>
      </div>
      <div className="co-sum-cashback">
        <div className="co-sum-row">
          <span className="co-sum-cb-lbl">Coupon Cashback</span>
          <span className="co-sum-cb-val"><Dh />{breakup.couponCashback}</span>
        </div>
        <div className="co-sum-cb-group">
          <div className="co-sum-row">
            <span className="co-sum-cb-lbl">noon one credit card</span>
            <span className="co-sum-cb-val"><Dh />{breakup.cardCashback}</span>
          </div>
          <p className="co-sum-cb-note">cashback will be credited to the primary cardholder's account</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Payment / checkout ----------------------------- */
function PaymentCheckout({ onBack, cartQty = {} }) {
  // Products are the same set the cart/checkout page carries: the PDP product
  // is always present, plus anything added from the bottom sheet (qty > 0).
  const addedItems = PAB_PRODUCTS
    .filter((p) => (cartQty[p.id] || 0) > 0)
    .map((p) => ({
      id: p.id, img: p.img, fit: p.fit, title: p.title,
      now: p.price, was: p.was,
      off: `${Math.round((1 - Number(p.price) / Number(p.was)) * 100)}% OFF`,
    }))
  const items = [CHECKOUT_ITEMS[0], ...addedItems]
  const qtys = { [CHECKOUT_ITEMS[0].id]: 1 }
  addedItems.forEach((it) => { qtys[it.id] = cartQty[it.id] || 1 })

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const totalNow = items.reduce((s, it) => s + Number(it.now) * (qtys[it.id] || 1), 0)
  const itemCount = items.reduce((s, it) => s + (qtys[it.id] || 1), 0)

  const breakup = { deliveryFee: 7, couponDiscount: 2, couponCashback: 30, cardCashback: 45 }
  const grandTotal = totalNow - breakup.couponDiscount
  const noonCredits = 50.5
  const remaining = Math.max(0, grandTotal - noonCredits)

  const [instr, setInstr] = useState('door')       // 'together' | 'door'
  const [pay, setPay] = useState('card')            // selected pay method
  const [useCredits, setUseCredits] = useState(true)

  return (
    <div className="pc">
      <div className="pc-top">
        <div className="statusbar">
          <span className="sb-time">9:41</span>
          <span className="sb-right">
            <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden><g fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></g></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden fill="currentColor"><path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM8 5c1.7 0 3.3.7 4.5 1.8l-1.4 1.4A4.4 4.4 0 0 0 8 7c-1.2 0-2.3.5-3.1 1.2L3.5 6.8A6.4 6.4 0 0 1 8 5zm0-4c2.8 0 5.4 1.1 7.3 3l-1.4 1.4A8.4 8.4 0 0 0 8 3 8.4 8.4 0 0 0 2.1 5.4L.7 4A10.4 10.4 0 0 1 8 1z"/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4"/></svg>
          </span>
        </div>
        <div className="pc-head">
          <button className="pc-back" onClick={onBack} aria-label="Back">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="pc-head-mid">
            <span className="pc-head-title">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z"/></svg>
              Delivering to Home
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg>
            </span>
            <span className="pc-head-sub">Villa 52, Springville, K, VGP Layout, Mh&hellip;</span>
          </div>
        </div>
      </div>

      <div className="pc-scroll">
        {/* Shipment */}
        <div className="pc-card pc-ship">
          <div className="pc-ship-head">
            <span className="pc-ship-title">SHIPMENT 1</span>
            <span className="pc-ship-count">{items.length} Item{items.length > 1 ? 's' : ''}</span>
          </div>

          {items.length > 1 ? (
            <div className="pc-ship-multi">
              {items.map((it, i) => (
                <div className="pc-mini" key={it.id}>
                  <div className="pc-mini-img">
                    <img src={it.img} alt={it.title} style={{ objectFit: it.fit }} />
                    {(qtys[it.id] || 1) > 1 && <span className="pc-item-qty">x{qtys[it.id]}</span>}
                  </div>
                  <div className="pc-mini-main">
                    <div className="pc-mini-title">{it.title}</div>
                    <div className="pc-item-price">
                      <span className="pc-now"><Dh />{it.now}</span>
                      <span className="pc-was"><Dh />{it.was}</span>
                      <span className="pc-off">{it.off}</span>
                    </div>
                    {i === 0 && <span className="pc-combo">Combo item</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            items.map((it) => (
              <div className="pc-item" key={it.id}>
                <div className="pc-item-img">
                  <img src={it.img} alt={it.title} style={{ objectFit: it.fit }} />
                  {(qtys[it.id] || 1) > 1 && <span className="pc-item-qty">x{qtys[it.id]}</span>}
                </div>
                <div className="pc-item-main">
                  <div className="pc-item-title">{it.title}</div>
                  <div className="pc-item-price">
                    <span className="pc-now"><Dh />{it.now}</span>
                    <span className="pc-was"><Dh />{it.was}</span>
                    <span className="pc-off">{it.off}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className={`pc-ship-eta${items.length > 1 ? ' pc-ship-eta-multi' : ''}`}>
            {items.length > 1 && (
              <svg className="pc-ship-eta-wave" width="215" height="52" viewBox="0 0 231.046 68.4021" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
                <path d="M196.124 8.97949H25.5197C24.6857 8.97949 23.8609 8.80562 23.0978 8.46898L18.2219 6.31777C14.2558 4.56799 9.8 7.47235 9.8 11.8073V48.6021C9.8 51.9158 12.4863 54.6021 15.8 54.6021H215.237C219.765 54.6021 222.661 49.7777 220.532 45.7811L203.185 13.2181C201.795 10.6094 199.08 8.97949 196.124 8.97949Z" fill="#F9F9FB"/>
              </svg>
            )}
            <span className="pc-eta-txt">Get it <b>{items.length > 1 ? 'in 1hrs 12mins' : 'Today before 8pm'}</b></span>
            <span className="pc-express" aria-hidden>
              <svg width="57" height="18" viewBox="0 0 57 17.1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M57 0C56.751 0.891985 54.0348 10.3557 53.22 12.6618C52.5409 14.6416 50.368 16.6866 46.4748 17.1C46.1353 17.0782 9.86876 17.1 9.18972 17.1H8.89546C8.75966 17.1 8.62385 17.1 8.48804 17.1C3.75737 16.9042 0 13.1622 0 8.57176C0 6.20038 0.99593 4.06832 2.603 2.52366C4.21007 0.957252 6.45091 0 8.89546 0H57Z" fill="#FEEE00"/>
                <path d="M9.66275 11.7569C10.4261 11.7569 11.2403 11.5148 11.8383 11.0846L11.3421 9.88795C10.9604 10.1972 10.337 10.3585 9.78997 10.3585C8.64495 10.3585 8.09789 9.61905 8.09789 9.06779C8.09789 9.02745 8.09789 8.94678 8.09789 8.90645H12.6653C12.7161 8.70477 12.7925 8.22073 12.7925 7.83082C12.7925 6.0157 11.6093 4.94007 10.0317 4.94007C7.98339 4.94007 6.48213 6.7283 6.48213 8.83922C6.48213 10.6543 7.72894 11.7569 9.66275 11.7569ZM11.3294 7.72326H8.276C8.40323 7.01065 9.05207 6.33839 9.92992 6.33839C10.8968 6.33839 11.3548 6.92998 11.3548 7.5888C11.3548 7.61569 11.3548 7.69637 11.3421 7.72326H11.3294Z" fill="#404553"/>
                <path d="M18.8832 11.5955L17.3819 8.26107L20.1045 5.10142H18.247L16.5549 7.09133L15.7153 5.10142H13.9596L15.3463 8.26107L12.471 11.5955H14.3158L16.186 9.40392L17.1402 11.5955H18.8832Z" fill="#404553"/>
                <path d="M23.4366 11.7569C25.5231 11.7569 26.6681 9.57871 26.6681 7.62914C26.6681 5.90814 25.7266 4.94007 24.3399 4.94007C23.602 4.94007 23.004 5.26276 22.4824 5.90814L22.6605 5.10142H21.0448L19.1619 14.0695H20.7776L21.4773 10.735C21.8845 11.3804 22.6096 11.7569 23.4366 11.7569ZM23.1694 10.2375C22.5206 10.2375 21.999 9.92829 21.7318 9.48459L22.2152 7.23922C22.546 6.79553 23.0549 6.4594 23.6147 6.4594C24.4035 6.4594 24.976 7.05099 24.976 7.97872C24.976 9.17535 24.2381 10.2375 23.1694 10.2375Z" fill="#404553"/>
                <path d="M28.7165 11.5955L29.6071 7.33334C29.9633 6.90309 30.5358 6.55351 31.1338 6.55351C31.3882 6.55351 31.6172 6.60729 31.719 6.63418L32.0753 4.94007C31.0956 4.94007 30.4341 5.32999 29.8997 5.94847L30.0778 5.10142H28.4621L27.1008 11.5955H28.7165Z" fill="#404553"/>
                <path d="M35.1077 11.7569C35.871 11.7569 36.6853 11.5148 37.2832 11.0846L36.787 9.88795C36.4054 10.1972 35.782 10.3585 35.2349 10.3585C34.0899 10.3585 33.5428 9.61905 33.5428 9.06779C33.5428 9.02745 33.5428 8.94678 33.5428 8.90645H38.1102C38.1611 8.70477 38.2374 8.22073 38.2374 7.83082C38.2374 6.0157 37.0542 4.94007 35.4766 4.94007C33.4283 4.94007 31.9271 6.7283 31.9271 8.83922C31.9271 10.6543 33.1739 11.7569 35.1077 11.7569ZM36.7743 7.72326H33.7209C33.8481 7.01065 34.497 6.33839 35.3748 6.33839C36.3418 6.33839 36.7998 6.92998 36.7998 7.5888C36.7998 7.61569 36.7998 7.69637 36.787 7.72326H36.7743Z" fill="#404553"/>
                <path d="M41.3892 11.7569C43.0686 11.7569 44.0482 10.7216 44.0482 9.48459C44.0482 7.50813 40.9185 7.68292 40.9185 6.88965C40.9185 6.55351 41.2365 6.28461 41.809 6.28461C42.5597 6.28461 43.323 6.7283 43.6156 7.13166L44.4553 5.98881C43.8701 5.35688 42.8904 4.94007 41.8472 4.94007C40.206 4.94007 39.3154 6.00225 39.3154 7.13166C39.3154 9.08123 42.4452 8.86611 42.4452 9.74006C42.4452 10.1031 42.1016 10.4123 41.5546 10.4123C40.664 10.4123 39.7734 9.84762 39.4045 9.39048L38.5012 10.5871C39.1882 11.3535 40.2696 11.7569 41.3892 11.7569Z" fill="#404553"/>
                <path d="M47.4522 11.7569C49.1316 11.7569 50.1112 10.7216 50.1112 9.48459C50.1112 7.50813 46.9815 7.68292 46.9815 6.88965C46.9815 6.55351 47.2996 6.28461 47.8721 6.28461C48.6227 6.28461 49.3861 6.7283 49.6787 7.13166L50.5183 5.98881C49.9331 5.35688 48.9535 4.94007 47.9102 4.94007C46.269 4.94007 45.3785 6.00225 45.3785 7.13166C45.3785 9.08123 48.5082 8.86611 48.5082 9.74006C48.5082 10.1031 48.1647 10.4123 47.6176 10.4123C46.7271 10.4123 45.8365 9.84762 45.4675 9.39048L44.5642 10.5871C45.2513 11.3535 46.3327 11.7569 47.4522 11.7569Z" fill="#404553"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Delivery instructions */}
        <div className="pc-card">
          <div className="pc-sec-head">
            Delivery instructions
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="9" fill="none" stroke="#9aa3b5" strokeWidth="1.8"/><path stroke="#9aa3b5" strokeWidth="2" strokeLinecap="round" d="M12 11v5M12 8h.01"/></svg>
          </div>
          <div className="pc-inst-grid">
            <button className={`pc-inst${instr === 'together' ? ' on' : ''}`} onClick={() => setInstr('together')}>
              <span className="pc-inst-ico" aria-hidden>
                <svg width="19" height="18" viewBox="0 0 18.3344 17.9167" fill="none"><path d="M6.02796 0.947873L6.32501 0L5.34195 0.142428C1.54349 0.692755 0.233607 3.77097 0.0284074 5.43944C-0.192777 7.2379 0.898651 8.91816 2.57074 9.39337C2.45604 8.04602 2.48809 6.80439 2.61462 5.69051L3.85663 5.8316C3.73239 6.92527 3.7053 8.16011 3.83668 9.51164C5.48431 9.36078 6.84624 8.0322 7.05877 6.30408C7.12579 5.75914 7.01633 5.24694 6.86331 4.78598C6.75585 4.46228 6.6114 4.12337 6.47636 3.80654C6.42557 3.68739 6.37611 3.57134 6.33045 3.46042C5.97728 2.60235 5.75185 1.82895 6.02796 0.947873Z" fill="#343D54"/><path d="M6.10283 13.5747C5.75743 13.9564 5.41702 14.3637 5.08346 14.7967C4.37358 12.897 3.99223 11.1215 3.83573 9.51161C3.59453 9.5337 3.3472 9.53054 3.09646 9.4997C2.91543 9.47744 2.73962 9.44161 2.56979 9.39334C2.73955 11.3874 3.23073 13.6131 4.21277 15.9989L4.224 15.9943C3.94833 16.4064 3.67895 16.8379 3.41703 17.289L4.49805 17.9166C5.19619 16.7141 5.94653 15.6645 6.72311 14.7608C6.57311 14.5567 6.43778 14.3341 6.31948 14.0933C6.23635 13.924 6.16423 13.7508 6.10283 13.5747Z" fill="#343D54"/><path d="M6.72367 14.7613C8.08675 13.175 9.53066 12.0385 10.915 11.3149L10.3359 10.2071C8.92335 10.9455 7.47393 12.0601 6.10325 13.5753C5.33154 11.3622 6.25178 8.6766 8.26612 7.30953C9.22139 6.66122 10.7357 6.0037 12.4452 5.97054C14.1814 5.93687 16.088 6.55006 17.7547 8.39639L18.3344 9.03853L17.5427 9.38718C16.3049 9.93227 15.5918 10.9923 14.9192 12.2148C14.8289 12.3788 14.738 12.5485 14.6459 12.7203C14.4083 13.1636 14.1631 13.6209 13.9038 14.0303C13.5378 14.608 13.1005 15.1644 12.5136 15.5627C10.5198 16.9158 8.04904 16.5636 6.72367 14.7613Z" fill="#343D54"/></svg>
              </span>
              <span className="pc-inst-lbl">Get items together</span>
              <span className={`pc-check${instr === 'together' ? ' on' : ''}`}>{instr === 'together' && <CheckMark />}</span>
            </button>
            <button className={`pc-inst${instr === 'door' ? ' on' : ''}`} onClick={() => setInstr('door')}>
              <span className="pc-inst-ico" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C15.95 2 16.5 3.05 16.5 9V17H17.25C17.6642 17 18 17.3358 18 17.75C18 18.1642 17.6642 18.5 17.25 18.5H2.75C2.33579 18.5 2 18.1642 2 17.75C2 17.3358 2.33579 17 2.75 17H3.5V9C3.5 3.05 4.55 2 10 2ZM10 3.5C9.59336 3.5 9.22219 3.50656 8.88281 3.51953C12.3563 3.68208 13 4.98805 13 10.5V17H15V9C15 7.5113 14.9639 6.43399 14.8389 5.625C14.7146 4.82123 14.5256 4.45447 14.3525 4.25684C14.196 4.07825 13.909 3.87429 13.21 3.72363C12.4859 3.56761 11.4692 3.5 10 3.5ZM10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12Z" fill="var(--blue)"/></svg>
              </span>
              <span className="pc-inst-lbl">Leave at the door</span>
              <span className={`pc-check${instr === 'door' ? ' on' : ''}`}>{instr === 'door' && <CheckMark />}</span>
            </button>
          </div>
        </div>

        {/* Receiver details */}
        <div className="pc-card">
          <div className="pc-sec-head">Receiver details</div>
          <div className="pc-receiver">
            <span className="pc-recv-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="var(--blue)" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"/></svg>
            </span>
            <div className="pc-recv-txt">
              <span className="pc-recv-name">Rahul Jaiswal</span>
              <span className="pc-recv-phone">+971 02124124</span>
            </div>
            <button className="pc-link">Change receiver</button>
          </div>
        </div>

        {/* Pay With */}
        <div className="pc-card">
          <div className="pc-sec-head">Pay With</div>
          <button className="pc-credits" onClick={() => setUseCredits((v) => !v)}>
            <span className={`pc-toggle${useCredits ? ' on' : ''}`}><i /></span>
            <span className="pc-credits-txt">Use my <Dh />{fmt(noonCredits)} noon credits</span>
          </button>
          <p className="pc-credits-note">Select another method to cover the remaining <Dh />{fmt(remaining)}</p>

          <div className="pc-methods">
            <button className={`pc-method${pay === 'tabby' ? ' on' : ''}`} onClick={() => setPay('tabby')}>
              <img className="pc-method-logo" src="/icons/save-tabby.png" alt="tabby" />
              <div className="pc-method-txt">
                <b>Tabby</b>
                <span>Pay 4 interest free payments of <Dh />55</span>
              </div>
              <span className="pc-badge-new pc-badge-inline">NEW</span>
            </button>
            <button className={`pc-method${pay === 'tamara' ? ' on' : ''}`} onClick={() => setPay('tamara')}>
              <img className="pc-method-logo" src="/icons/save-tamara.png" alt="tamara" />
              <div className="pc-method-txt">
                <b>Tamara</b>
                <span>Pay <Dh />55 or in 4 payments. no late fees</span>
              </div>
            </button>
            <div className={`pc-method pc-method-card${pay === 'card' ? ' on' : ''}`} onClick={() => setPay('card')}>
              <div className="pc-method-cardhead">
                <span className="pc-card-chip">
                  <svg width="16" height="12" viewBox="0 0 24 18" aria-hidden><rect x="1" y="1" width="22" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path stroke="currentColor" strokeWidth="1.6" d="M1 6h22"/></svg>
                </span>
                <b>Debit/Credit Card</b>
                <button className="pc-link">Add/Change</button>
              </div>
              <div className="pc-card-row">
                <img className="pc-card-thumb" src="/icons/pay-card.png" alt="card" />
                <div className="pc-card-info">
                  <span className="pc-card-name">Yomna Yassin's de&hellip;</span>
                  <span className="pc-card-inst">Installments Available <Dh />200/mo</span>
                </div>
                <span className="pc-card-num">&bull;&bull;&bull;&bull; 6280</span>
                <span className="pc-cvv">CVV</span>
              </div>
            </div>
            <div className="pc-method-noon">
              <img className="pc-noon-card" src="/icons/pay-noon-card.png" alt="noon One credit card" />
              <div className="pc-method-txt">
                <b>noon One Credit Card</b>
                <span>Extra <Dh />110.20 Cashback <Dh />55</span>
              </div>
              <button className="pc-link">Apply Now</button>
            </div>

            <button className={`pc-method${pay === 'cod' ? ' on' : ''}`} onClick={() => setPay('cod')}>
              <span className="pc-cash">CASH</span>
              <div className="pc-method-txt"><b>Cash on Delivery</b></div>
            </button>
          </div>
        </div>
      </div>

      <div className="pc-dock">
        <button className="pc-swipe">
          <span className="pc-swipe-knob">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
          <span className="pc-swipe-txt">ENTER CVV</span>
        </button>
        <div className="pc-dock-row">
          <span className="pc-dock-items">{itemCount} Items</span>
          <span className="pc-dock-amt"><Dh />{fmt(grandTotal)}</span>
        </div>
      </div>
      <div className="pc-homebar" />
    </div>
  )
}

function CheckMark() {
  return <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
}

/* ----------------------------- Status bar + header ----------------------------- */
/* Shared top navigation. state 1: back + search(icon) + wishlist + share.
   state 2: back + search(pill) + share. */
function TopNav({ state = 1, onBack }) {
  return (
    <div className="tb-nav">
      <button className="tb-btn" onClick={onBack} aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div className="tb-actions">
        {state === 2 ? (
          <motion.button
            className="tb-search"
            aria-label="Search"
            initial={{ width: 44 }}
            animate={{ width: 112 }}
            exit={{ width: 44 }}
            transition={{ type: 'tween', ease: [0.22, 0.61, 0.36, 1], duration: 0.32 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m20 20-3.5-3.5"/></svg>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>Search</motion.span>
          </motion.button>
        ) : (
          <button className="tb-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.9"/><path stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" d="m20 20-3.5-3.5"/></svg>
          </button>
        )}
        {state === 1 && (
          <button className="tb-btn" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="1.9" d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.6 12 20 12 20z"/></svg>
          </button>
        )}
        <button className="tb-btn" aria-label="Share">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" d="M12 3v13M8 7l4-4 4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>
        </button>
      </div>
    </div>
  )
}

function StatusBar() {
  return (
    <div className="pdp-topbar">
      <TopNav state={1} />
    </div>
  )
}

/* --------------------------------- Gallery --------------------------------- */
function Gallery({ imgScale, imgOpacity }) {
  return (
    <div className="gallery">
      <motion.img
        className="gallery-img"
        style={{ scale: imgScale, opacity: imgOpacity }}
        src="/anker-charger.png"
        alt="Anker 737 GaN USB-C charger"
      />
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

function MainInfo({ onBestseller }) {
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

      <button className="bestseller" onClick={onBestseller}>
        <span className="bs-badge">
          <svg viewBox="0 0 16 16" aria-hidden><path fill="#1d2539" d="M8 0l1.6 1.2 2-.2.9 1.8 1.8.9-.2 2L15.9 8l-1.2 1.6.2 2-1.8.9-.9 1.8-2-.2L8 15.9l-1.6-1.2-2 .2-.9-1.8-1.8-.9.2-2L.1 8l1.2-1.6-.2-2 1.8-.9.9-1.8 2 .2z"/></svg>
          <span className="bs-badge-num">1</span>
        </span>
        <span className="bs-txt">Bestseller #1 in <a>Chargers</a></span>
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

/* --------------------- Product at a glance (AI summary) -------------------- */
const GLANCE_BULLETS = [
  'Fast charges laptops and smartphones',
  'Power up 3 devices at once',
  'Works with MacBook, iPhone & Samsung',
  'Efficient GaN technology for less heat',
  'Compact enough for everyday travel',
]
function Sparkle({ className = '' }) {
  return (
    <svg className={className} width="11" height="12" viewBox="0 0 11 12" aria-hidden>
      <path fill="currentColor" d="M5.5 0c.3 2.3 1.2 3.2 3.5 3.5-2.3.3-3.2 1.2-3.5 3.5C5.2 4.7 4.3 3.8 2 3.5 4.3 3.2 5.2 2.3 5.5 0Z"/>
      <path fill="currentColor" d="M9 7c.15 1.1.6 1.55 1.7 1.7C9.6 8.85 9.15 9.3 9 10.4c-.15-1.1-.6-1.55-1.7-1.7C8.4 8.55 8.85 8.1 9 7Z"/>
    </svg>
  )
}
function ProductGlance() {
  const [open, setOpen] = useState(false)
  const bullets = open ? GLANCE_BULLETS : GLANCE_BULLETS.slice(0, 2)
  return (
    <section className="glance">
      <div className="glance-head">
        <span className="glance-title">Product at a glance<Sparkle className="glance-spark" /></span>
        <button className="glance-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? 'See less' : 'See more'}
          <Chev className={`glance-chev${open ? ' up' : ''}`} />
        </button>
      </div>
      <ul className="glance-list">
        {bullets.map((b) => (
          <li key={b}><span className="glance-dot" />{b}</li>
        ))}
      </ul>
      {open && (
        <div className="glance-ai"><Sparkle className="glance-ai-spark" /><span className="glance-ai-txt">Summarised by AI</span></div>
      )}
    </section>
  )
}

/* ------------------------------ Payment offers ----------------------------- */
const PAY_OFFERS = [
  { img: '/icons/pay-noon-card.png', kind: 'card', inline: true },
  { img: '/icons/save-tabby.png', kind: 'logo', title: 'Get extra 5% cashback', sub: 'on using ENBD noon VISA credit card' },
  { img: '/icons/save-tamara.png', kind: 'logo', title: 'Split your payment in 4', sub: 'Pay zero interest on 4 instalments' },
]
function PaymentOffers() {
  return (
    <section className="card pay-offers">
      <h3 className="po-title">Payment offers</h3>
      <div className="po-rail">
        {PAY_OFFERS.map((o, i) => (
          <div className="po-card" key={i}>
            <span className={`po-icon po-icon-${o.kind}`}><img src={o.img} alt="" /></span>
            {o.inline ? (
              <p className="po-desc"><b>Get extra 5% cashback</b> using ENBD noon VISA credit card <a className="po-cta">Apply Now</a></p>
            ) : (
              <div className="po-stack">
                <p className="po-h">{o.title}</p>
                <p className="po-sub">{o.sub}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------ Variant picker ----------------------------- */
const VP_COLOURS = [
  { name: '735 GaN', img: '/anker-charger.png' },
  { name: '735 GaN II', img: '/pab-wallcharger.jpg' },
  { name: '736 GaN II', img: '/pab-anker737.png' },
  { name: '736 GaN', img: '/pab-powerbank.png', oos: true },
]
function VariantPicker() {
  const [version, setVersion] = useState('UK 3 PIN')
  const [model, setModel] = useState('UK 3 PIN')
  const [colour, setColour] = useState('735 GaN II')
  return (
    <section className="card variant-picker">
      <div className="vp-group">
        <div className="vp-head">
          <h3 className="vp-title">Versions</h3>
          <button className="vp-link"><InfoDot /> Learn more</button>
        </div>
        <div className="vp-chips">
          {['UK 3 PIN', 'US 2 PIN'].map((v) => (
            <button key={v} className={`vp-chip${version === v ? ' on' : ''}`} onClick={() => setVersion(v)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="vp-group">
        <div className="vp-head">
          <h3 className="vp-title">Charger Model</h3>
          <button className="vp-link">Size Guide <Chev className="row-chev" /></button>
        </div>
        <div className="vp-chips">
          {['UK 3 PIN', 'US 2 PIN'].map((v) => (
            <button key={v} className={`vp-chip${model === v ? ' on' : ''}`} onClick={() => setModel(v)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="vp-group">
        <div className="vp-head">
          <h3 className="vp-title">Colour</h3>
          <button className="vp-link vp-viewall">View All</button>
        </div>
        <div className="vp-colours">
          {VP_COLOURS.map((c) => (
            <button
              key={c.name}
              className={`vp-colour${colour === c.name ? ' on' : ''}${c.oos ? ' oos' : ''}`}
              onClick={() => !c.oos && setColour(c.name)}
            >
              <span className="vp-colour-img">
                <img src={c.img} alt={c.name} />
                {c.oos && <span className="vp-oos">OUT OF STOCK</span>}
              </span>
              <span className="vp-colour-name">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
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

/* ------------------------------ Ratings & Reviews ----------------------------- */
const REVIEW_SUMMARY = [
  'The portrait mode includes a fantastic wide-angle',
  'Users appreciate the overall performance of phone.',
  'Enjoy the wide-angle capability while using portrait a fantastic wide-angle',
  'Users appreciate the overall performance of this phone.',
]
const REVIEW_PHOTOS = ['/icons/rev-photo-1.png', '/icons/rev-photo-2.png', '/icons/rev-photo-3.png', '/icons/rev-photo-1.png']
const TOP_REVIEWS = [
  {
    id: 'r1', name: 'John Anderson', stars: 4, verified: true, when: '8 days ago',
    specs: ['Mac OS', '8 GB RAM', 'Internal Version', '256 GB'],
    title: 'This is simply amazing!',
    body: 'If the camera had the wide angle feature in the portrait mode. If the camera has more fe..',
    more: 'More', helpful: 15, photos: ['/icons/rev-photo-1.png', '/icons/rev-photo-2.png'],
  },
  {
    id: 'r2', name: 'John Anderson', stars: 5, source: 'from trusted source', when: '6 months ago',
    specs: ['Mac OS', '8 GB RAM', 'Internal Version', '256 GB'],
    title: 'This is simply amazing!',
    body: 'If the camera had the wide angle feature in the portrait mode. If the camera has more fewer features than than the last one it will be worse better than others.',
    more: 'Less', helpful: 14, photos: ['/icons/rev-photo-1.png', '/icons/rev-photo-2.png'],
  },
]

function Stars({ value, size = 15 }) {
  return (
    <span className="rv-stars" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden className={i < value ? 'on' : ''}>
          <path fill="currentColor" d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.6 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/>
        </svg>
      ))}
    </span>
  )
}

function Reviews() {
  return (
    <section className="card reviews">
      <h3 className="section-h">Ratings &amp; Reviews</h3>

      <div className="rv-summary-top">
        <span className="rv-score">4.8</span>
        <Stars value={5} size={20} />
        <button className="rv-info" aria-label="About ratings">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 11v5M12 8h.01"/></svg>
        </button>
      </div>
      <p className="rv-sub">Avg. rating based on 64 reviews from trusted sources</p>

      <button className="rv-ai">
        <span className="rv-ai-txt"><b>64 reviews</b>, summarised by <b className="rv-ai-noon">noon AI</b></span>
        <svg className="rv-ai-spark" width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/></svg>
      </button>
      <ul className="rv-bullets">
        {REVIEW_SUMMARY.map((t, i) => <li key={i}>{t}</li>)}
      </ul>

      <h4 className="rv-h">Photo Reviews (64)</h4>
      <div className="rv-photos">
        {REVIEW_PHOTOS.map((src, i) => <img key={i} src={src} alt="review" />)}
      </div>

      <h4 className="rv-h">Top Reviews (64)</h4>
      {TOP_REVIEWS.map((r) => (
        <div className="rv-card" key={r.id}>
          <div className="rv-card-head">
            <span className="rv-name">{r.name}</span>
            {r.verified && (
              <span className="rv-verified">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="10" fill="var(--emerald)"/><path fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M7 12.5l3.2 3.2L17 9"/></svg>
                Verified Buy
              </span>
            )}
          </div>
          <div className="rv-card-sub">
            <Stars value={r.stars} />
            <span className="rv-when">{r.source ? `${r.source} · ${r.when}` : r.when}</span>
          </div>
          <div className="rv-specs">
            {r.specs.map((s) => <span className="rv-spec" key={s}>{s}</span>)}
          </div>
          <div className="rv-viewprod">
            <span>Dual core memory</span>
            <button className="rv-vp-link">View product <Chev className="rv-vp-chev" /></button>
          </div>
          <div className="rv-title">{r.title}</div>
          <p className="rv-body">{r.body} <span className="rv-more">{r.more}</span></p>
          <button className="rv-translate">Translate to <span className="rv-ar">عربي</span></button>
          <div className="rv-card-photos">
            {r.photos.map((src, i) => <img key={i} src={src} alt="review" />)}
          </div>
          <button className="rv-helpful">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-8a2 2 0 0 1 2 2v3h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"/></svg>
            Helpful ({r.helpful})
          </button>
        </div>
      ))}

      <button className="rv-all">All customer reviews <Chev className="rv-all-chev" /></button>
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
