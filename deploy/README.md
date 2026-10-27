# Clyx Studio

نفس تنسيق النشر في `D:\project\DEPLOY.md`.

- النوع: vite
- الأسرار: `DEPLOY_HOST` `DEPLOY_USER` `DEPLOY_SSH_KEY` `DEPLOY_PATH` `APP_URL`
- `DEPLOY_SSH_PORT` اختياري، والافتراضي 22
- لتطبيق Node أضف `APP_SERVICE` باسم وحدة systemd
- ملف `.env` يبقى على الخادم ولا يرفع مع الكود

## نموذج التواصل

- `VITE_CONTACT_EMAIL` اختياري: البريد الذي يفتح له النموذج مسودة `mailto`.
- يُقرأ وقت البناء (`npm run build`) لا وقت التشغيل، فيجب تعريفه في بيئة البناء أو في `.env.production.local` قبل البناء.
- إن لم يُعرّف، لا يرسل النموذج شيئاً ويعرض للزائر أن البريد غير مُعدّ بعد.
