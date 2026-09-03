# 3D Resume - কমপ্লিট হোস্টিং ও ডিপ্লয়মেন্ট গাইড

এই ডকুমেন্টে আপনার MERN Stack (Monorepo) প্রজেক্টটি বিভিন্ন ধরণের সার্ভারে লাইভ বা হোস্ট করার বিস্তারিত নিয়মকানুন উদাহরণসহ তুলে ধরা হলো। আপনার প্রয়োজন ও বাজেট অনুযায়ী যেকোনো একটি পদ্ধতি বেছে নিতে পারেন।

---

## পদ্ধতি ১: Monorepo হোস্টিং (সবচেয়ে সহজ - Vercel)
যেহেতু আপনার প্রজেক্টটি একটি Monorepo (একই ফোল্ডারে ফ্রন্টএন্ড ও ব্যাকএন্ড) এবং এতে `vercel.json` ও `api/index.js` কনফিগার করা আছে, তাই Vercel-এ পুরো প্রজেক্টটি একসাথে হোস্ট করা সবচেয়ে সহজ।

**সুবিধা:** ফ্রি, কোনো ঝামেলা নেই, CORS এরর হবে না (কারণ ডোমেইন একটাই)।

**সেটআপ নিয়ম:**
1. Vercel ড্যাশবোর্ডে গিয়ে প্রজেক্ট ইম্পোর্ট করুন।
2. **Framework Preset:** Vite
3. **Root Directory:** `./` (ডিফল্ট যা আছে)
4. **Build Command:** `npm run build`
5. **Output Directory:** `client/dist`
6. **Environment Variables:** আপনার লোকাল `.env` ফাইলের সবকিছু এখানে দিন। 
   *(উদাহরণ: `MONGODB_URI=mongodb+srv://...`, `JWT_SECRET=mySecretKey` ইত্যাদি)*
7. **Deploy:** ক্লিক করুন। আপনার ফ্রন্টএন্ড স্ট্যাটিক সাইট হিসেবে এবং ব্যাকএন্ড Serverless Function হিসেবে রান করবে।

---

## পদ্ধতি ২: ভিন্ন ভিন্ন হোস্টিং (Decoupled Hosting)
আপনি চাইলে ফ্রন্টএন্ড Vercel-এ এবং ব্যাকএন্ড Render, Railway বা Heroku-তে আলাদাভাবে হোস্ট করতে পারেন।

**সুবিধা:** বড় স্কেলের প্রজেক্টের জন্য ভালো, ব্যাকএন্ডের ফুল কন্ট্রোল থাকে।

**ধাপ ১: ব্যাকএন্ড হোস্টিং (যেমন Render-এ)**
1. Render-এ Web Service তৈরি করে গিটহাব রিপোজিটরি কানেক্ট করুন।
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment Variables:** ডাটাবেস ইউআরএল, সিক্রেট কি এবং সবচেয়ে গুরুত্বপূর্ণ— `CLIENT_URL=https://your-frontend.vercel.app` (CORS এর জন্য)।
6. ডিপ্লয় করার পর একটি এপিআই লিংক পাবেন (যেমন: `https://my-api.onrender.com`)।

**ধাপ ২: ফ্রন্টএন্ড হোস্টিং (যেমন Vercel-এ)**
1. Vercel-এ প্রজেক্ট ইম্পোর্ট করুন।
2. Root, Build, Output Directory পদ্ধতি-১ এর মতোই রাখবেন।
3. **Environment Variable:** এখানে ব্যাকএন্ডের লিংকটি দিতে হবে। 
   `VITE_API_URL=https://my-api.onrender.com/api`
4. Deploy করুন।

---

## পদ্ধতি ৩: Shared Hosting (cPanel)
যেকোনো সাধারণ হোস্টিং (Namecheap, Hostinger) যেখানে cPanel এবং Node.js সাপোর্ট আছে।

**সুবিধা:** কম খরচ, একটি হোস্টিং প্যানেল থেকেই সব মেইনটেইন করা যায়।

**ধাপ ১: ব্যাকএন্ড সেটআপ (নিরাপদ পদ্ধতি)**
1. cPanel এর "File Manager" এ যান। `public_html` এর **বাইরে** (যাতে সোর্স কোড কেউ দেখতে না পারে) নতুন একটি ফোল্ডার তৈরি করুন, যেমন: `resume-backend`। 
2. আপনার লোকাল প্রজেক্টের `server` ফোল্ডারের ভেতরের সব ফাইল জিপ (zip) করে ওই `resume-backend` ফোল্ডারে আপলোড করে আনজিপ করুন।
3. cPanel এর "Setup Node.js App" এ যান। 
   - **Application root:** `resume-backend` (যে ফোল্ডারটি বানালেন)
   - **Application URL:** একটি সাবডোমেইন সিলেক্ট করুন (যেমন: `api.yourdomain.com`)
   - **Application startup file:** `server.js`
4. `npm install` রান করুন এবং Environment Variables (MongoDB URI, JWT_SECRET ইত্যাদি) cPanel UI থেকে অ্যাড করে অ্যাপটি **Start** করুন।

**ধাপ ২: ফ্রন্টএন্ড সেটআপ (পাবলিক ফোল্ডার)**
1. আপনার লোকাল কম্পিউটারে `client/.env` ফাইলে `VITE_API_URL=https://api.yourdomain.com/api` লিখে সেভ করুন।
2. কমান্ড দিন: `npm run build`
3. এরপর `client/dist` ফোল্ডারের ভেতরে যা যা তৈরি হবে, সবগুলোকে cPanel এর `public_html` ফোল্ডারে আপলোড করে দিন। (যদি মেইন ডোমেইনে দেখাতে চান, তাহলে সরাসরি `public_html` এ রাখবেন। আর যদি কোনো নির্দিষ্ট লিংকে দেখাতে চান, তবে `public_html/portfolio` নামে ফোল্ডার বানিয়ে সেখানে রাখবেন)।
4. **রাউটিং ফিক্স (খুবই জরুরি):** ফ্রন্টএন্ডের ফাইল যেখানে রেখেছেন (যেমন `public_html`), সেখানে একটি `.htaccess` নামের ফাইল তৈরি করুন এবং নিচের কোডটি পেস্ট করে সেভ করুন। এটি না করলে অন্য পেজে গিয়ে রিলোড দিলে 404 Error আসবে।
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## পদ্ধতি ৪: VPS (Virtual Private Server) হোস্টিং
DigitalOcean, AWS EC2, বা Linode-এ লিনাক্স সার্ভার কিনে ম্যানুয়ালি সেটআপ করা।

**সুবিধা:** সর্বোচ্চ পারফরম্যান্স, সম্পূর্ণ স্বাধীনতা, কোনো লিমিটেশন নেই।

**সার্ভার সেটআপ (Ubuntu):**
1. সার্ভারে SSH দিয়ে লগইন করুন।
2. Node.js, MongoDB (যদি নিজস্ব ডাটাবেস চান), Nginx, এবং PM2 ইন্সটল করুন।
```bash
sudo apt update
sudo apt install nodejs npm nginx
sudo npm install -g pm2
```

**প্রজেক্ট ডিপ্লয়:**
1. গিটহাব থেকে প্রজেক্ট ক্লোন করুন: `git clone <repo-link>`
2. প্যাকেজ ইন্সটল করুন: `npm run install:all`
3. `.env` ফাইল তৈরি করে ভ্যালুগুলো বসান।
4. ফ্রন্টএন্ড বিল্ড করুন: `npm run build`

**ব্যাকএন্ড চালু করা (PM2 দিয়ে):**
```bash
cd server
pm2 start server.js --name "resume-api"
pm2 save
pm2 startup
```

**Nginx Reverse Proxy কনফিগারেশন:**
Nginx-কে বলতে হবে যেন সে ফ্রন্টএন্ডের স্ট্যাটিক ফাইলগুলো সার্ভ করে এবং `/api` রিকোয়েস্টগুলো ব্যাকএন্ডে (পোর্ট 5000) পাঠিয়ে দেয়।

`/etc/nginx/sites-available/default` ফাইলটি এডিট করে নিচের মতো কনফিগার করুন:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # ফ্রন্টএন্ড সার্ভ করা
    location / {
        root /var/www/resume3d/client/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
এরপর Nginx রিস্টার্ট দিন (`sudo systemctl restart nginx`) এবং SSL যুক্ত করার জন্য Certbot (`sudo certbot --nginx`) ব্যবহার করুন।

---
*এই ডকুমেন্টটি প্রজেক্টের ভবিষ্যতের জন্য রেফারেন্স হিসেবে রাখা হলো।*
