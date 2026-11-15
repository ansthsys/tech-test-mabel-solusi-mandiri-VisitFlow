# Tech Test - Mabel Solusi Mandiri

**Visit Flow** adalah prototipe aplikasi web untuk membantu tim lapangan mencatat dan memantau kunjungan ke berbagai entitas (B2G/B2B). Frontend React terhubung ke backend Elysia/Bun dengan database PostgreSQL.

## Fitur

- Login memakai Better Auth (session cookie) dengan akun demo.
- Daftar entitas dengan pencarian dan filter segmen.
- Daftar rencana kunjungan (activity) dengan pencarian dan filter segmen, status, serta rentang tanggal.
- Tambah rencana kunjungan: memilih entitas, segmen, dan tanggal kunjungan, disertai validasi.
- Ubah status kunjungan (`NOT_VISITED` / `VISITED`) dan isi nama sales secara opsional.
- Dashboard ringkasan: total entitas, total activity, activity berstatus visited, dan not visited.

## Persyaratan Sistem

- **Bun** `>= 1.1` (`bun --version`).
- **PostgreSQL** `>= 13` yang berjalan lokal.
- Role database yang boleh membuat dan menghapus database (dipakai migrasi dan database pengujian).

## Teknologi dan Alasan Pemilihan

- **Bun.** Bun saya pilih karena cepat dan sudah menyatukan package manager, runtime, serta test runner. Frontend dan backend memakai alat yang sama.
- **Elysia.** Elysia saya pilih untuk menguji diri. Ini pertama kali saya memakainya; sebelumnya saya hanya sering membaca dokumentasinya. Beberapa hari sebelumnya saya mengeksplorasi integrasi Cloudflare ke Elysia. Elysia mendukung berbagai serverless function, jadi ini waktu yang tepat untuk mencobanya. Saya sering mengeksplorasi layanan gratis, dan baru menyadari Elysia bisa berjalan di Cloudflare. Karena itu saya semakin tertarik menjadikannya framework utama, terutama karena biaya deployment lebih ringan bila nanti masuk production.
- **React.** React saya pilih karena saya menguasainya.

Pustaka lain mengikuti bawaan boilerplate.

## Struktur Repository

```
client/   Frontend React (Vite)
server/   Backend Elysia (Bun), skema Drizzle, migrasi, seed, dan pengujian
```

## Persiapan Backend

```bash
cd server
bun install

# Siapkan berkas environment
cp .env.example .env
# Sunting .env, minimal:
#   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/tech_test-mabel_solusi_mandiri-visit_flow
#   BETTER_AUTH_SECRET=<string acak, minimal 32 karakter>
#   BETTER_AUTH_URL=http://localhost:3000
#   CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Pastikan database pada DATABASE_URL sudah ada
bun run db:migrate
bun run db:seed
bun run dev
```

- API: `http://localhost:3000`
- Dokumentasi OpenAPI (Scalar): `http://localhost:3000/docs`

## Persiapan Frontend

```bash
cd client
bun install

cp .env.example .env
# .env: VITE_API_URL=http://localhost:3000/api

bun run dev
```

- Aplikasi: `http://localhost:5173`

## Akun Demo

```
email:    admin@email.com
password: Admin123!
```

Akun demo dibuat oleh skrip seed. Seluruh endpoint API (kecuali health check dan route auth) memerlukan session login.

## Pengisian Data Awal (Seed)

```bash
cd server
bun run db:seed
```

Skrip seed bersifat idempoten (upsert) dan membuat:

- akun admin demo,
- **28 entitas** dengan variasi B2G/B2B, tipe, dan region,
- **12 rencana kunjungan** yang mereferensikan entitas tersebut.

Nilai `entity_id` pada rencana kunjungan memakai format gabungan yang sama dengan API (`name-type-segment-region` tanpa spasi), bukan UUID asli dari entitas.

## Pengujian

Pengujian backend mencakup API dan aturan bisnis: auth guard, CRUD dan filter activity, entitas, serta health check.

```bash
cd server
bun test
```

Konfigurasi pengujian memakai `server/.env.test`. Berkas ini **tidak perlu disalin**; ia sudah tersedia di repositori. Nilai koneksi database di dalamnya harus disesuaikan dengan lingkungan Anda (user, password, dan host PostgreSQL).

Aturan penting:

- Nama database pada `DATABASE_URL` di `.env.test` **wajib berakhiran `-testing`**.
- Contoh: `postgresql://postgres:root@localhost:5432/tech_test-mabel_solusi_mandiri-visit_flow-testing`.
- Proses pengujian akan membuat database tersebut bila belum ada, menjalankan migrasi, lalu menghapusnya setelah pengujian selesai.
- Alat pengujian menolak berjalan pada database yang namanya tidak berakhiran `-testing`, sebagai pengaman agar data pengembangan tidak ikut terhapus.
- Role database harus memiliki izin membuat dan menghapus database (umumnya superuser `postgres`).

Frontend belum memiliki pengujian otomatis; alur UI diverifikasi secara manual.

## Ringkasan API

### Umum

| Method | Path | Kegunaan |
|---|---|---|
| `GET` | `/` | Informasi API (nama, versi, path docs dan health). |
| `GET` | `/health` | Health check: status server, uptime, dan konektivitas database. |
| `GET` | `/docs` | Dokumentasi OpenAPI (Scalar). |

### Auth (`/api/auth`, Better Auth)

| Method | Path | Kegunaan |
|---|---|---|
| `POST` | `/api/auth/sign-in/email` | Login dan membuat session (cookie). |

### Entities

| Method | Path | Kegunaan |
|---|---|---|
| `GET` | `/api/entities` | Daftar entitas untuk dipilih. Query: `search`, `segment`. Fallback ke riwayat kunjungan bila master data tidak menghasilkan pilihan. |
| `GET` | `/api/entities/:entityId` | Mengambil satu entitas berdasarkan UUID atau id gabungan. |

### Activities (rencana kunjungan)

| Method | Path | Kegunaan |
|---|---|---|
| `GET` | `/api/activities` | Daftar activity. Query: `search`, `segment`, `status`, `from`, `to`. |
| `POST` | `/api/activities` | Membuat rencana kunjungan (`entityId`, `segment`, `visitDate`). |
| `GET` | `/api/activities/:id` | Mengambil satu activity. |
| `PATCH` | `/api/activities/:id` | Mengubah status (`status`, opsional `salesName`). |

### Posts (contoh boilerplate, tidak dipakai alur utama)

| Method | Path | Kegunaan |
|---|---|---|
| `GET` | `/api/posts` | Daftar post. |
| `GET` | `/api/posts/:id` | Mengambil satu post. |
| `POST` | `/api/posts` | Membuat post (perlu login). |
| `PUT` | `/api/posts/:id` | Mengubah post (perlu login, hanya pemilik). |
| `DELETE` | `/api/posts/:id` | Menghapus post (perlu login, hanya pemilik). |

Filter tanggal bersifat inklusif (`from <= visit_date <= to`) dan diterapkan di SQL, bukan hanya di tampilan. Filter dapat dikombinasikan. Endpoint entities dan activities memerlukan session login.

## Batasan yang Diketahui

> Jika master data tidak menyediakan pilihan yang relevan, API boleh menyediakan entitas dari riwayat kunjungan sebagai alternatif.

1. Berdasarkan kalimat tersebut saya menilai bahwa master data entitas dapat dihapus datanya, saya memutuskan untuk menjadikan value `visit_plans.entity_*` sebagai snapshot dalam table `visit_plans`. Itulah kenapa terdapat field yang redundant antara table `entities` dan table `visit_plans`. Daripada menggunakan `entity_id` sebagai foreign key, saya mengulang semua value dari `entities` (kecuali segmen) yang dipilih user saat pembuatan `visit_plans`, ini dilakukan untuk menjaga history dari data tersebut.

> Pengguna dapat memilih entitas, tanggal, dan segmen.

2. Terdapat kejanggalan alur data antara contoh response entitas dengan kalimat tersebut. Saya anggap entitas adalah source of truth yang akan digunakan untuk mengisi seluruh value di `visit_plans.entity_*`, maka seharusnya user hanya memili entitas dan tanggal saja di frontend saat pembuatan `visit_plans`. Tapi karena segmen wajib ada sebagai input yang dipilih user, maka saya membuat apapun segmen yang dipilih user nanti di frontend sebagai value dari `visit_plans.segment`, segment dalam table `visit_plans` bukan merupakan snapshot.

> Hindari pilihan entitas duplikat. Jika terdapat nama serupa, gunakan jenis entitas untuk membedakannya.

3. Berdasarkan kalimat tersebut, saya berasumsi ada suatu kondisi dimana master data entitas sudah dihapus ataupun kosong, dan di history `visit_plans` terdapat banyak sekali data entitas yang sama dengan berbagai kombinasi seperti memiliki nama; tipe; segment yang sama tapi memiliki region yang berbeda, ataupun contoh kombinasi lainnya adalah nama; region yang sama tapi tipe; segmen berbeda. Ini akan membuat user sulit memilih mana entitas yang benar, untuk mengatasinya saya memilih `visit_plans.entity_id` agar menggunakan format string custom daripada menggunakan id bawaan dari `entities.id`, dimana formatnya berupa gabungan antara `name-type-segment-region`, hal ini akan menghandel apapun kombinasi entitas yang memiliki data yang sama. Untuk mempermudah user dalam memilih saya menampilkan seluruh informasi dari entitas yang muncul di pilihan nanti terlepas pilihan tersebut muncul dari master data atau dari histori. Untuk pengaman `visit_plans.entity_id` kustom, saya menerapkan length pada setiap field database dan juga menerapkan validation, dengan rule nama entitas maksimal 100 karakter, tipe entitas 50 karakter, dan region entitas 50 karakter.

## Penggunaan AI

**Penggunaan AI: ~24% · Implementasi manual: ~76%** (estimasi, logika implementasi).

Dokumentasi README ini ditulis dengan bantuan AI. Laporan ini juga diaudit ulang oleh AI itu sendiri dan didiskusikan, sehingga angka tersebut diperoleh.

### Cara Perhitungan

Persentase dihitung atas **logika implementasi**. Kontribusi AI diberi bobot berdasarkan upaya implementasi, bukan jumlah baris mentah, karena sebagian besar keluaran AI adalah data berulang dan boilerplate yang membuat hitungan baris menjadi berlebihan.

Bobot yang dipakai: data/boilerplate `0.3–0.5`, CRUD/wiring `0.7–0.8`, perbaikan halus `0.8–0.9`.

Dikeluarkan dari pembilang dan penyebut:

- starter kit UI via `degit` (template admin shadcn pihak ketiga),
- migrasi Drizzle yang dihasilkan otomatis,
- `node_modules` dan lockfile,
- dataset seed (data, bukan logika) dan perangkat/konfigurasi pengujian (skrip infrastruktur),
- perubahan sepele (penghapusan menu/route yang tidak dipakai, perapian header, string terjemahan).

### Area yang Dibantu AI

| Area | Bantuan AI |
|---|---|
| Auth | service sign-in/sign-out dan hook React Query, `withCredentials`, `trustedOrigins` di server |
| Shared UI | opsi clearable pada `SelectInput`, perbaikan kegagalan pagination DataTable |
| Tambah rencana kunjungan | penanganan submit, validasi zod, wiring field tanggal, tombol submit/reset |
| Ubah status | halaman + route + aksi per baris, `useUpdateActivity` (PATCH), penanganan id tidak ditemukan |
| Dashboard | penghitung ringkasan entitas/activity |
| Konfigurasi server | `trustedOrigins` untuk cookie session lintas origin |

### Ditulis Manual

- Filter di sisi server: pencarian, segmen, status, dan rentang tanggal inklusif.
- Model data entitas, desain `visit_plans.entity_id` gabungan, dan fallback master data ke riwayat kunjungan.
- UI daftar/detail serta state loading, empty, dan error.
- Pengujian API untuk activity, entitas, dan health; serta isi data seed.
- Perbaikan integrasi dan validasi akhir.

AI dipakai sebagai asisten. Seluruh kode yang dihasilkan ditinjau, dijalankan, dan disesuaikan dengan kebutuhan.
