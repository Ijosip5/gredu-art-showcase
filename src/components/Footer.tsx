import { Link } from "@tanstack/react-router";
import { ChevronDown, Instagram, Youtube, ArrowUpRight, MapPin, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

const ARCHIVES = [
  { label: "Gredupedia 2024", href: "https://example.com/gredupedia-2024" },
  { label: "Gredupedia 2025", href: "https://example.com/gredupedia-2025" },
];

export function Footer() {
  const [openArchive, setOpenArchive] = useState(false);

  return (
    <footer className="mt-24 border-t border-border bg-ink text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold">
            Gredupedia <span className="text-highlight">2026</span>
          </h3>
          <p className="mt-3 max-w-sm text-sm text-background/70">
            Pameran digital dan showcase portofolio mahasiswa Teknologi Pendidikan, Universitas
            Negeri Yogyakarta.
          </p>
          <div className="mt-5 space-y-2 text-sm text-background/70">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" /> Karangmalang, Sleman, Yogyakarta
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" /> halo@gredupedia.id
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-background/50">
            Navigasi
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="text-background/75 transition-smooth hover:text-highlight">
                Beranda
              </Link>
            </li>
            <li>
              <a
                href="/#program"
                className="text-background/75 transition-smooth hover:text-highlight"
              >
                Program
              </a>
            </li>
            <li>
              <Link
                to="/karya"
                className="text-background/75 transition-smooth hover:text-highlight"
              >
                Galeri Karya
              </Link>
            </li>
            <li>
              <a
                href="/#dokumentasi"
                className="text-background/75 transition-smooth hover:text-highlight"
              >
                Dokumentasi
              </a>
            </li>
            <li>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-background/75 transition-smooth hover:text-highlight"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-highlight" /> Admin Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-background/50">
            Ikuti Kami
          </h4>
          <div className="mt-4 flex gap-2">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Gredupedia"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-background/20 transition-smooth hover:bg-accent hover:text-accent-foreground"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Gredupedia"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-background/20 transition-smooth hover:bg-accent hover:text-accent-foreground"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setOpenArchive((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-background/20 px-4 py-3 text-sm font-medium transition-smooth hover:border-highlight/60"
            >
              Arsip Edisi Sebelumnya
              <ChevronDown
                className={`h-4 w-4 transition-smooth ${openArchive ? "rotate-180" : ""}`}
              />
            </button>
            {openArchive && (
              <ul className="mt-2 space-y-1 rounded-xl border border-background/10 bg-background/5 p-2">
                {ARCHIVES.map((a) => (
                  <li key={a.label}>
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-background/80 transition-smooth hover:bg-background/10 hover:text-highlight"
                    >
                      {a.label} <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 px-5 py-6 text-center text-xs text-background/50">
        © 2026 Gredupedia — Teknologi Pendidikan, Universitas Negeri Yogyakarta.
      </div>
    </footer>
  );
}
