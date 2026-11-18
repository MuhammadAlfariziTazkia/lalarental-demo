/* ==========================================================================
   Lala Rent Car — DATA ASLI (sumber: dataasli.txt dari client)
   Semua teks bisnis di website dirender dari file ini.
   ATURAN: jangan menambahkan informasi yang tidak ada di data asli client.
   ========================================================================== */
window.LALA = {
  config: {
    name: "Lala Rent Car",
    tagline: "Sewa Mobil Jabodetabek & Nusantara",
    base: "Bekasi",
    area: "Jabodetabek & Nusantara",
    address: "Bekasi",
    // Semua tombol "Pesan via WhatsApp" diarahkan ke WA 1 (keputusan client)
    wa: [
      { label: "WA 1", display: "0812-1806-6593", intl: "6281218066593" },
      { label: "WA 2", display: "0857-1199-7131", intl: "6285711997131" }
    ],
    waMessage: "Halo Lala Rent Car, saya mau pesan mobil."
  },

  /* Armada — HARGA FINAL dari client.
     name = nama resmi model (data asli: Avanza, Expander, Reborn, Hiace, Hiace Premio, Fortuner, Alphard).
     img  = foto ilustrasi model (bukan unit milik Lala). null → kartu tanpa foto ("Foto unit menyusul"). */
  cars: [
    { id: "avanza", brand: "Toyota", name: "Avanza", price: 500000, unit: "12 Jam", body: "mpv",
      img: "assets/img/cars/avanza.jpg", pos: "center 62%" },
    { id: "xpander", brand: "Mitsubishi", name: "Xpander", price: 500000, unit: "12 Jam", body: "mpv",
      img: null },
    { id: "reborn", brand: "Toyota", name: "Kijang Innova Reborn", price: 750000, unit: "12 Jam", body: "mpv",
      img: "assets/img/cars/kijang-innova-reborn.jpg", pos: "center 62%" },
    { id: "hiace", brand: "Toyota", name: "Hiace", price: 1400000, unit: "Full Day", body: "van", hiaceNote: true,
      img: "assets/img/cars/hiace.jpg", pos: "center 55%" },
    { id: "hiace-premio", brand: "Toyota", name: "Hiace Premio", price: 1800000, unit: "Full Day", body: "van", hiaceNote: true,
      img: "assets/img/cars/hiace-premio.jpg", pos: "center 52%" },
    { id: "fortuner", brand: "Toyota", name: "Fortuner", price: 2000000, unit: "12 Jam", body: "suv",
      img: "assets/img/cars/fortuner.jpg", pos: "center 45%" },
    { id: "alphard", brand: "Toyota", name: "Alphard", price: 2500000, unit: "12 Jam", body: "van",
      img: null }
  ],

  /* Catatan wajib di bawah harga Hiace & Hiace Premio */
  hiaceNotes: [
    "Sudah termasuk BBM",
    "Di luar tol, parkir & masuk wisata",
    "Full Day = dari pagi sampai malam (sampai jam 23.00)"
  ],

  steps: [
    { title: "Pilih mobil di WA", icon: "message-circle" },
    { title: "Tentukan tanggal + jemput", icon: "calendar-check" },
    { title: "DP booking 50% dari harga sewa", icon: "wallet" }
  ],

  services: [
    { title: "Dengan Sopir", icon: "user-check", img: "assets/img/svc-dengan-sopir.jpg" },
    { title: "Antar-Jemput Bandara", sub: "Soekarno-Hatta / Halim", icon: "plane-landing", img: "assets/img/svc-bandara.jpg" },
    { title: "Luar Kota & Wisata", sub: "Nusantara", icon: "route", img: "assets/img/svc-luar-kota.jpg" }
  ],

  reasons: [
    { title: "Unit terawat", desc: "Bersih dan wangi.", icon: "sparkles" },
    { title: "Sopir profesional", desc: "Handal, ramah, dan sopan.", icon: "user-check" },
    { title: "Admin balas WA cepat", desc: "Pesan dan tanya langsung lewat WhatsApp.", icon: "message-circle" }
  ],

  faqs: [
    { q: "Apa syarat sewa?",
      a: "Syarat sewa dijelaskan langsung oleh admin. Silakan hubungi kami via WhatsApp." },
    { q: "Apakah harga sudah termasuk BBM, tol, parkir?",
      a: "Untuk Hiace, sudah termasuk BBM, di luar tol, parkir & masuk wisata. Untuk unit lainnya, silakan tanyakan ke admin via WhatsApp." },
    { q: "Bagaimana cara bayar?",
      a: "DP booking 50% dari harga sewa." }
  ],

  /* Turunan "Jabodetabek" + layanan bandara dari data asli */
  areas: ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi", "Soekarno-Hatta", "Halim", "Nusantara"]
};
