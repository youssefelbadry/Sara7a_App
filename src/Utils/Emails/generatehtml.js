export const template = (code, firstName, subject) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Confirmation</title>
  <style>
    body {
      background: linear-gradient(135deg, #e7f0ff, #f8fbff);
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 50px 0;
    }

    .container {
      max-width: 600px;
      background: linear-gradient(180deg, #ffffff 0%, #f5f9ff 60%, #e9f1ff 100%);
      margin: 0 auto;
      border-radius: 16px;
      padding: 45px 50px;
      box-shadow: 0 12px 35px rgba(0, 85, 255, 0.1);
      border: 1px solid rgba(0, 120, 255, 0.05);
    }

    .logo {
      text-align: center;
      margin-bottom: 25px;
    }

    .logo img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
    }

    h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 12px;
      text-align: center;
    }

    p {
      font-size: 15px;
      line-height: 1.6;
      color: #555;
      text-align: center;
      margin: 0 0 20px;
    }

    .code-box {
      padding: 30px 20px;
      margin: 35px auto;
      text-align: center;
      max-width: 400px;
    }

    .button {
      display: inline-block;
      background: linear-gradient(135deg, #007bff, #00bfff, #66ccff);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(0,114,255,0.25);
      transition: all 0.3s ease-in-out;
    }

    .button:hover {
      background: linear-gradient(135deg, #006ae6, #0099ff, #4dc3ff);
      transform: translateY(-2px);
    }

    .footer {
      text-align: center;
      font-size: 13px;
      color: #777;
      margin-top: 35px;
      border-top: 1px solid #e3e9f7;
      padding-top: 20px;
      line-height: 1.6;
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .footer-content img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      object-fit: cover;
    }

    .footer a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    .highlight {
      color: #0052cc;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://yt3.googleusercontent.com/ytc/AIdro_krEjITi07cOEBrX0041BBduaCdRKLUO4o6MmV6C5VfiJo=s900-c-k-c0x00ffffff-no-rj" alt="Route Academy Logo" />
    </div>

    <h2>Hello ${firstName}, Welcome to <span class="highlight">Route Academy</span></h2>
    <p>Thanks for joining us! You're one step away from unlocking your learning journey.</p>
    <p>Please ${subject} using the code below 👇</p>

    <div class="code-box">
      <a class="button">${code}</a>
    </div>

    <p style="font-size:13px; color:#999;">This code will expire in 24 hours. If you didn’t sign up for this account, please ignore this email.</p>

    <div class="footer">
      <div class="footer-content">
        <img src="https://yt3.googleusercontent.com/ytc/AIdro_krEjITi07cOEBrX0041BBduaCdRKLUO4o6MmV6C5VfiJo=s900-c-k-c0x00ffffff-no-rj" alt="Route Academy Logo" />
        <p>&copy; 2024 <span class="highlight">Route Academy</span>. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
