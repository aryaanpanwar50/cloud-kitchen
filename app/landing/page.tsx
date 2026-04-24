import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, ChefHat, Star } from "lucide-react";
import * as motion from "framer-motion/client";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] overflow-x-hidden" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Nav ── */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 relative z-50">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          <span className="text-[#FF5F40]">Urban</span>Eats
        </Link>
        <nav className="hidden items-center gap-10 text-sm font-bold md:flex">
          <Link href="/" className="text-[#1A1A1A]">Home</Link>
          <Link href="#how-it-works" className="text-[#6B6B6B] transition hover:text-[#1A1A1A]">How it Works</Link>
          <Link href="#collections" className="text-[#6B6B6B] transition hover:text-[#1A1A1A]">Menu</Link>
        </nav>
        <div className="flex items-center gap-4">
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
            <button type="submit" className="rounded-full px-6 py-2.5 text-sm font-bold text-[#1A1A1A] transition hover:bg-gray-200/50">
              Log in
            </button>
          </form>
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
            <button type="submit" className="rounded-full bg-[#1A1A1A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF5F40] hover:shadow-lg hover:shadow-[#FF5F40]/30 hover:-translate-y-0.5">
              Sign up
            </button>
          </form>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-7xl px-6 pt-10 pb-20 lg:pt-16 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10">
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF5F40]/20 bg-[#FF5F40]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FF5F40] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#FF5F40] animate-pulse" />
              New: Artisan Pizza Series
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-6xl font-black leading-[1.05] tracking-tight text-[#1A1A1A] md:text-7xl lg:text-[5rem]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Cravings,<br />
              <span className="relative inline-block">
                <span className="relative z-10 text-white">delivered.</span>
                <motion.span 
                  initial={{ scaleX: 0 }} 
                  animate={{ scaleX: 1 }} 
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 -z-10 block rounded-2xl bg-[#FF5F40] origin-left scale-y-110 -rotate-2" 
                />
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-8 max-w-lg text-lg leading-relaxed text-[#6B6B6B]">
              Premium cloud-based kitchen bringing chef-curated meals directly to your doorstep. Quality ingredients, expertly prepared, in 30 minutes.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-5">
              <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
                <button type="submit" className="group flex items-center gap-3 rounded-full bg-[#FF5F40] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#FF5F40]/20 transition-all hover:bg-[#E04A2A] hover:scale-105 active:scale-95">
                  Order Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ perspective: 1000 }}
            className="relative h-[400px] w-full lg:h-[600px] hidden md:block"
          >
            <motion.div 
              whileHover={{ rotateY: -10, rotateX: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute right-0 top-0 h-4/5 w-4/5 overflow-hidden rounded-[2rem] shadow-2xl z-20"
            >
              <Image src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80" alt="Pizza" fill className="object-cover" unoptimized />
              <div className="absolute bottom-4 left-4 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-bold shadow-lg flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9 Artisan Pizza
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute left-0 bottom-0 h-[60%] w-3/5 overflow-hidden rounded-[2rem] shadow-2xl z-30 border-8 border-[#F9F9F7]"
            >
              <Image src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" alt="Bowl" fill className="object-cover" unoptimized />
              <div className="absolute bottom-4 right-4 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-bold shadow-lg">
                Fresh Bowls
              </div>
            </motion.div>

            {/* Decorative background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#FF5F40]/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ── Curated Collections ── */}
      <section id="collections" className="relative bg-white py-20 lg:py-28 rounded-t-[3rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)] -mt-10 z-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-[#1A1A1A] md:text-5xl" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Curated Collections</h2>
            <p className="mt-4 text-lg text-[#6B6B6B]">Hand-picked selections crafted by top chefs for every craving.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={staggerContainer}
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12 lg:h-[500px]"
          >
            {/* Large card */}
            <motion.div 
              variants={fadeUp} 
              style={{ perspective: 1000 }}
              className="md:col-span-8 lg:col-span-8 h-[400px] lg:h-full"
            >
              <motion.div 
                whileHover={{ rotateX: 2, rotateY: -2, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="group relative h-full w-full overflow-hidden rounded-[2rem] bg-[#F0EDE8] shadow-lg cursor-pointer"
              >
                <Image src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1000&q=80" alt="Guilty Pleasures" fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="mb-3 inline-block rounded-full bg-[#FF5F40] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">Chef&apos;s Special</span>
                  <h3 className="text-3xl font-black text-white md:text-4xl" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Guilty Pleasures</h3>
                  <p className="mt-2 text-white/80 max-w-md hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Indulge in our most decadent, rich, and satisfying comfort foods.</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Side cards column */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-6 h-full">
              {[
                { label: "Wellness Bowls", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", desc: "Healthy & Fresh" },
                { label: "Asian Fusion", img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80", desc: "Spicy & Bold" },
              ].map((c) => (
                <motion.div 
                  key={c.label} 
                  variants={fadeUp} 
                  style={{ perspective: 1000 }}
                  className="h-[250px] lg:flex-1"
                >
                  <motion.div 
                    whileHover={{ rotateX: -2, rotateY: 2, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="group relative h-full w-full overflow-hidden rounded-[2rem] bg-[#F0EDE8] shadow-lg cursor-pointer"
                  >
                    <Image src={c.img} alt={c.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                      <p className="text-sm font-bold text-[#FF5F40] mb-1">{c.desc}</p>
                      <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{c.label}</h3>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-[#1A1A1A] py-24 relative overflow-hidden">
        {/* Background decorative grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center">
            <h2 className="text-4xl font-black text-white md:text-5xl" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>How It Works</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              We&apos;ve engineered the perfect delivery experience from pan to plate.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={staggerContainer}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: <CheckCircle2 className="h-8 w-8" />,
                title: "Choose & Order",
                desc: "Mix and match from multiple premium kitchen brands in one single cart.",
              },
              {
                icon: <ChefHat className="h-8 w-8" />,
                title: "Expertly Crafted",
                desc: "Our top chefs prepare your meal using state-of-the-art intelligent ovens.",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Swift Delivery",
                desc: "AI-routed delivery ensures your food arrives hot, fresh, and on time.",
              },
            ].map((step, i) => (
              <motion.div 
                variants={fadeUp} 
                whileHover={{ y: -10 }}
                key={step.title} 
                className="relative rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <div className="absolute -top-6 -right-6 text-9xl font-black text-white/5 pointer-events-none select-none">
                  {i + 1}
                </div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5F40] text-white shadow-lg shadow-[#FF5F40]/20">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{step.title}</h3>
                <p className="text-base leading-relaxed text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Chef's Highlights ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 bg-[#F9F9F7]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#1A1A1A] md:text-5xl" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Trending Now</h2>
            <p className="mt-3 text-lg text-[#6B6B6B]">The dishes everyone is talking about this week.</p>
          </div>
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
            <button type="submit" className="group flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-transparent px-6 py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white">
              View Entire Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </motion.div>
        
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { name: "Truffle Umami Burger", desc: "Caramelized onions, swiss cheese", price: "₹16.50", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
            { name: "Lemon Herb Salmon", desc: "Atlantic salmon, grilled asparagus", price: "₹22.00", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
            { name: "Midnight Miso Ramen", desc: "12-hour broth, chashu pork", price: "₹14.95", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80" },
            { name: "Pacific Tuna Poke", desc: "Sashimi-grade tuna, edamame", price: "₹18.25", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
          ].map((item) => (
            <motion.div 
              variants={fadeUp} 
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              key={item.name} 
              className="group overflow-hidden rounded-[2rem] bg-white shadow-sm hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden bg-[#F0EDE8]">
                <Image src={item.img} alt={item.name} fill className="object-cover transition duration-700 group-hover:scale-110" unoptimized />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-[#1A1A1A] shadow-sm">
                  🔥 Trending
                </div>
              </div>
              <div className="p-6">
                <p className="text-xl font-bold text-[#1A1A1A] line-clamp-1" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{item.name}</p>
                <p className="mt-2 text-sm text-[#6B6B6B] line-clamp-1">{item.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-black text-[#FF5F40]">{item.price}</span>
                  <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
                    <button type="submit" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EDE8] text-[#1A1A1A] transition-all hover:bg-[#FF5F40] hover:text-white hover:scale-110 active:scale-95">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E8E8E4] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              <span className="text-[#FF5F40]">Urban</span>Eats
            </Link>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-[#6B6B6B]">
              Elevating the digital dining experience through culinary excellence and logistics precision.
            </p>
            <p className="mt-8 text-sm font-bold text-[#A0A0A0]">© 2024 UrbanEats Kitchen.</p>
          </div>
          {[
            { heading: "Discover", links: ["Menu", "Allergens", "Delivery Areas"] },
            { heading: "Company", links: ["Our Story", "Sustainability", "Careers"] },
            { heading: "Help", links: ["Support", "FAQ", "Terms"] },
          ].map(col => (
            <div key={col.heading}>
              <p className="mb-6 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">{col.heading}</p>
              <ul className="space-y-4">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-base text-[#6B6B6B] transition hover:text-[#FF5F40] font-medium">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
}