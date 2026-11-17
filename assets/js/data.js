/* ==========================================================================
   Lala Rent Car — Data mock
   Semua konten bisnis (nomor WA, armada, harga, zona antar) ada di sini.
   Ganti nilai di file ini saat produksi — tidak perlu menyentuh HTML.
   ========================================================================== */
window.LALA = {
  config: {
    brand: "Lala Rent Car",
    wa: "6281299990000",               // format internasional tanpa "+" (placeholder)
    waDisplay: "+62 812-9999-0000",
    phone: "(021) 7190-0000",
    email: "halo@lalarentcar.id",
    instagram: "@lalarentcar",
    address: "Jl. Kemang Raya No. 27, Bangka, Mampang Prapatan, Jakarta Selatan 12730",
    mapQuery: "Kemang Raya, Jakarta Selatan",
    hours: [
      ["Senin – Jumat", "06.00 – 22.00"],
      ["Sabtu – Minggu", "06.00 – 23.00"],
      ["Hari libur nasional", "07.00 – 21.00"],
      ["Chat WhatsApp", "24 jam"]
    ],
    since: 2016
  },

  /* Tarif: lepas = per 24 jam (tanpa sopir), sopir = per 12 jam (termasuk sopir, belum BBM).
     null = layanan tidak tersedia untuk unit tersebut. */
  cars: [
    {
      id: "honda-jazz", brand: "Honda", name: "Jazz RS", type: "City Car",
      year: 2022, seats: 5, trans: "Matic", fuel: "Bensin", bags: 2, cc: "1.500 cc",
      lepas: 375000, sopir: 600000, bbm: 200000,
      plate: "B 1207 LLA", rating: 4.9, trips: 412, popular: 3,
      img: "assets/img/cars/honda-jazz.jpg", pos: "center 60%",
      gallery: ["assets/img/cars/honda-jazz.jpg", "assets/img/svc-lepas-kunci.jpg", "assets/img/jakarta-light-trails.jpg", "assets/img/hero-jakarta-night.jpg"],
      blurb: "Lincah menembus macet Jakarta, irit, dan gampang parkir. Favorit untuk meeting harian dan jalan-jalan berdua.",
      badge: "Paling irit"
    },
    {
      id: "honda-city", brand: "Honda", name: "City Sedan", type: "Sedan",
      year: 2021, seats: 5, trans: "Matic", fuel: "Bensin", bags: 3, cc: "1.500 cc",
      lepas: 400000, sopir: 650000, bbm: 200000,
      plate: "B 1312 LLA", rating: 4.8, trips: 286, popular: 5,
      img: "assets/img/cars/honda-city.jpg", pos: "center 58%",
      gallery: ["assets/img/cars/honda-city.jpg", "assets/img/interior-premium.jpg", "assets/img/jakarta-skyline.jpg", "assets/img/jakarta-light-trails.jpg"],
      blurb: "Sedan kabin senyap dengan bagasi lega. Tampil rapi untuk urusan bisnis tanpa terasa berlebihan.",
      badge: null
    },
    {
      id: "kijang-innova", brand: "Toyota", name: "Kijang Innova", type: "MPV",
      year: 2019, seats: 7, trans: "Manual", fuel: "Bensin", bags: 3, cc: "2.000 cc",
      lepas: 450000, sopir: 650000, bbm: 250000,
      plate: "B 1509 LLA", rating: 4.8, trips: 538, popular: 2,
      img: "assets/img/cars/kijang-innova.jpg", pos: "center 72%",
      gallery: ["assets/img/cars/kijang-innova.jpg", "assets/img/svc-luar-kota.jpg", "assets/img/jakarta-semanggi-aerial.jpg", "assets/img/svc-dengan-sopir.jpg"],
      blurb: "MPV legendaris yang tangguh untuk keluarga besar. Pilihan aman untuk mudik, ziarah, atau rombongan kantor.",
      badge: "Hemat keluarga"
    },
    {
      id: "innova-reborn", brand: "Toyota", name: "Innova Reborn", type: "MPV",
      year: 2023, seats: 7, trans: "Matic", fuel: "Diesel", bags: 3, cc: "2.400 cc",
      lepas: 650000, sopir: 850000, bbm: 300000,
      plate: "B 1801 LLA", rating: 4.9, trips: 731, popular: 1,
      img: "assets/img/cars/innova-reborn.jpg", pos: "center 60%",
      gallery: ["assets/img/cars/innova-reborn.jpg", "assets/img/interior-premium.jpg", "assets/img/svc-bandara.jpg", "assets/img/svc-luar-kota.jpg"],
      blurb: "Kabin lapang, suspensi empuk, dan mesin diesel bertenaga. Unit paling laris kami untuk perjalanan antar kota.",
      badge: "Terlaris"
    },
    {
      id: "toyota-fortuner", brand: "Toyota", name: "Fortuner VRZ", type: "SUV",
      year: 2022, seats: 7, trans: "Matic", fuel: "Diesel", bags: 3, cc: "2.400 cc",
      lepas: 1200000, sopir: 1450000, bbm: 350000,
      plate: "B 1919 LLA", rating: 4.9, trips: 204, popular: 4,
      img: "assets/img/cars/toyota-fortuner.jpg", pos: "center 62%",
      gallery: ["assets/img/cars/toyota-fortuner.jpg", "assets/img/cars/fortuner-2.jpg", "assets/img/svc-luar-kota.jpg", "assets/img/interior-premium.jpg"],
      blurb: "Gagah, tinggi, dan siap segala medan. Cocok untuk tamu VIP, perjalanan ke Puncak, atau jalur luar kota.",
      badge: null
    },
    {
      id: "mercedes-glc", brand: "Mercedes-Benz", name: "GLC 300", type: "Premium",
      year: 2023, seats: 5, trans: "Matic", fuel: "Bensin", bags: 3, cc: "2.000 cc Turbo",
      lepas: null, sopir: 2750000, bbm: 400000,
      plate: "B 1 LLA", rating: 5.0, trips: 96, popular: 6,
      img: "assets/img/cars/mercedes-glc.jpg", pos: "center 55%",
      gallery: ["assets/img/cars/mercedes-glc.jpg", "assets/img/interior-premium.jpg", "assets/img/svc-wedding.jpg", "assets/img/svc-corporate.jpg"],
      blurb: "Kemewahan yang tenang untuk hari istimewa: pernikahan, tamu kehormatan, atau roadshow eksekutif. Wajib dengan sopir.",
      badge: "Premium"
    },
    {
      id: "toyota-hiace", brand: "Toyota", name: "Hiace Premio", type: "Van",
      year: 2022, seats: 14, trans: "Manual", fuel: "Diesel", bags: 8, cc: "2.800 cc",
      lepas: null, sopir: 1650000, bbm: 450000,
      plate: "B 7014 LLA", rating: 4.9, trips: 167, popular: 7,
      img: "assets/img/cars/hiace.jpg", pos: "center 48%",
      gallery: ["assets/img/cars/hiace.jpg", "assets/img/svc-luar-kota.jpg", "assets/img/bandara-runway.jpg", "assets/img/jakarta-semanggi-aerial.jpg"],
      blurb: "Kapasitas 14 kursi dengan AC dingin merata. Andalan untuk outing kantor, rombongan wisata, dan city tour.",
      badge: "Rombongan"
    }
  ],

  /* Zona antar/jemput unit */
  zones: [
    { id: "garasi", label: "Ambil sendiri di garasi Lala (Kemang)", fee: 0 },
    { id: "jaksel", label: "Antar ke Jakarta Selatan", fee: 0 },
    { id: "jakarta", label: "Antar ke Jakarta Pusat / Barat / Timur / Utara", fee: 75000 },
    { id: "halim", label: "Bandara Halim Perdanakusuma", fee: 100000 },
    { id: "bodetabek", label: "Bogor / Depok / Tangerang / Bekasi", fee: 150000 },
    { id: "soetta", label: "Bandara Soekarno-Hatta (CGK)", fee: 200000 }
  ],

  discounts: [
    { minDays: 30, pct: 20, label: "Sewa bulanan" },
    { minDays: 7, pct: 10, label: "Sewa mingguan" }
  ],

  services: [
    { id: "lepas-kunci", title: "Lepas Kunci", short: "Setir sendiri, bebas atur rute.", img: "assets/img/svc-lepas-kunci.jpg", from: 375000, unit: "/24 jam" },
    { id: "dengan-sopir", title: "Dengan Sopir", short: "Sopir berpengalaman, hafal jalan tikus Jakarta.", img: "assets/img/svc-dengan-sopir.jpg", from: 600000, unit: "/12 jam" },
    { id: "bandara", title: "Antar-Jemput Bandara", short: "Soekarno-Hatta & Halim, tepat waktu, pantau jadwal pesawat.", img: "assets/img/svc-bandara.jpg", from: 350000, unit: "/trip" },
    { id: "corporate", title: "Corporate & Bulanan", short: "Kontrak fleksibel, invoice resmi, unit pengganti.", img: "assets/img/svc-corporate.jpg", from: 9500000, unit: "/bulan" },
    { id: "wedding", title: "Mobil Pengantin", short: "Unit premium + dekorasi bunga untuk hari bahagia.", img: "assets/img/svc-wedding.jpg", from: 2750000, unit: "/12 jam" },
    { id: "luar-kota", title: "Luar Kota & Wisata", short: "Bandung, Puncak, Jogja, hingga Bali via darat.", img: "assets/img/svc-luar-kota.jpg", from: 850000, unit: "/12 jam" }
  ],

  testimonials: [
    { name: "Rani Pratiwi", role: "Karyawan swasta · Tebet", text: "Pesan jam 10 malam lewat WhatsApp, besok pagi Jazz-nya sudah diantar ke rumah. Mobil wangi, bensin sesuai, adminnya ramah banget.", car: "Honda Jazz RS", color: "#f3c9a8" },
    { name: "Dimas Aditya", role: "Mudik ke Semarang", text: "Sewa Innova Reborn seminggu untuk mudik. Harga sudah termasuk diskon mingguan, unit prima, dan ada nomor darurat 24 jam. Bakal langganan.", car: "Innova Reborn", color: "#c9b79c" },
    { name: "Sarah Wijaya", role: "Wedding · Kebayoran Baru", text: "Mercedes untuk pernikahan kami datang lengkap dengan dekorasi bunga. Sopirnya sopan, rapi berbatik, dan on time. Terima kasih Lala!", car: "Mercedes-Benz GLC", color: "#e8b4a0" },
    { name: "Budi Santoso", role: "HR Manager · Perusahaan logistik", text: "Kontrak bulanan 6 unit untuk tim sales. Invoice rapi, unit pengganti cepat saat servis berkala. Proses administrasi sangat profesional.", car: "Kontrak Corporate", color: "#b9cbbf" },
    { name: "Yuni & keluarga", role: "Liburan ke Puncak", text: "Hiace-nya bersih, AC dingin sampai belakang. Sopir sabar banget walau anak-anak minta berhenti terus. Recommended!", car: "Toyota Hiace Premio", color: "#f0d9a6" }
  ],

  faqs: [
    { q: "Apa saja syarat sewa lepas kunci?", a: "KTP elektronik, SIM A aktif, Kartu Keluarga, serta satu dokumen pendukung (NPWP, ID karyawan, atau kartu mahasiswa). Kami juga meminta deposit yang dikembalikan penuh setelah unit kembali. Detail lengkap ada di halaman <a href='panduan.html#syarat' class='link-underline accent'>Panduan Sewa</a>." },
    { q: "Apakah harga sudah termasuk BBM, tol, dan parkir?", a: "Harga dasar belum termasuk BBM, tol, dan parkir. Untuk layanan dengan sopir, Anda bisa memilih paket <b>All-in BBM</b> saat memesan. Uang makan sopir sudah termasuk untuk pemakaian dalam kota." },
    { q: "Bagaimana cara pembayarannya?", a: "Booking dikonfirmasi dengan DP 30% via transfer bank atau QRIS. Pelunasan dilakukan saat serah terima unit (transfer, QRIS, atau tunai). Pelanggan corporate bisa menggunakan invoice dengan termin." },
    { q: "Bisa diantar ke rumah atau bandara?", a: "Bisa. Antar-jemput gratis untuk area Jakarta Selatan. Area lain dan bandara dikenakan biaya flat yang langsung terlihat di kalkulator harga." },
    { q: "Bagaimana jika pemakaian melebihi waktu sewa?", a: "Overtime dihitung 10% dari tarif harian per jam. Lebih dari 4 jam dihitung sebagai tambahan satu hari. Kabari admin lebih awal agar jadwal unit bisa kami atur." },
    { q: "Bagaimana kebijakan pembatalan?", a: "Pembatalan H-3 atau lebih: DP kembali 100%. H-1 sampai H-2: DP kembali 50%. Di hari H: DP hangus. Reschedule gratis satu kali selama unit tersedia." },
    { q: "Apakah mobil diasuransikan?", a: "Seluruh unit diasuransikan all-risk. Untuk lepas kunci, risiko sendiri (own risk) maksimal Rp 1.000.000 per kejadian bila terjadi kerusakan akibat kelalaian." }
  ]
};
