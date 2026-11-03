<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>API is ON — MAN 2 Kota Madiun</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #06110d;
            --panel: rgba(10, 28, 20, 0.72);
            --line: rgba(52, 211, 153, 0.18);
            --green: #34d399;
            --green-dim: #10b981;
            --mint: #a7f3d0;
            --text: #ecfdf5;
            --muted: #86a89a;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { min-height: 100%; }

        body {
            font-family: Outfit, system-ui, sans-serif;
            color: var(--text);
            background:
                radial-gradient(900px 500px at 12% -10%, rgba(16, 185, 129, 0.22), transparent 55%),
                radial-gradient(700px 420px at 110% 10%, rgba(5, 150, 105, 0.16), transparent 50%),
                linear-gradient(180deg, #04110c 0%, #071812 50%, #05140f 100%);
            overflow-x: hidden;
        }

        .grid {
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(rgba(52, 211, 153, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(52, 211, 153, 0.05) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
            pointer-events: none;
        }

        .orb {
            position: fixed;
            width: 420px;
            height: 420px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(52, 211, 153, 0.18), transparent 70%);
            filter: blur(8px);
            animation: float 9s ease-in-out infinite;
            pointer-events: none;
        }

        .orb-a { top: -80px; right: -60px; }
        .orb-b { bottom: -120px; left: -80px; animation-delay: -4s; }

        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(24px) scale(1.06); }
        }

        .wrap {
            position: relative;
            z-index: 1;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 32px 20px;
        }

        .card {
            width: min(720px, 100%);
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 28px;
            padding: 36px 32px 28px;
            backdrop-filter: blur(18px);
            box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.03) inset,
                0 30px 80px rgba(0, 0, 0, 0.35);
            animation: rise 0.7s ease both;
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 28px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .mark {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: grid;
            place-items: center;
            background: linear-gradient(145deg, #34d399, #059669);
            color: #042f22;
            font-weight: 800;
            letter-spacing: -0.04em;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
        }

        .brand small {
            display: block;
            color: var(--muted);
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            margin-bottom: 2px;
        }

        .brand strong { font-size: 15px; font-weight: 600; }

        .live {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 12px;
            border-radius: 999px;
            border: 1px solid rgba(52, 211, 153, 0.35);
            background: rgba(16, 185, 129, 0.12);
            color: var(--mint);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--green);
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
            animation: ping 1.6s infinite;
        }

        @keyframes ping {
            0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55); }
            70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
            100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }

        h1 {
            font-size: clamp(42px, 8vw, 72px);
            line-height: 0.95;
            letter-spacing: -0.05em;
            font-weight: 800;
            margin-bottom: 10px;
        }

        h1 span {
            background: linear-gradient(90deg, #ecfdf5, #34d399 55%, #6ee7b7);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .sub {
            color: var(--muted);
            font-size: 16px;
            max-width: 42ch;
            margin-bottom: 28px;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }

        .stat {
            border: 1px solid var(--line);
            background: rgba(4, 20, 16, 0.55);
            border-radius: 16px;
            padding: 14px 14px 12px;
        }

        .stat label {
            display: block;
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 6px;
        }

        .stat b {
            font-family: "IBM Plex Mono", ui-monospace, monospace;
            font-size: 14px;
            font-weight: 500;
            color: var(--mint);
        }

        .term {
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--line);
            background: #03140f;
        }

        .term-bar {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 14px;
            background: rgba(52, 211, 153, 0.06);
            border-bottom: 1px solid var(--line);
            color: var(--muted);
            font-size: 12px;
            font-family: "IBM Plex Mono", ui-monospace, monospace;
        }

        .c { width: 8px; height: 8px; border-radius: 50%; }
        .c1 { background: #f87171; }
        .c2 { background: #fbbf24; }
        .c3 { background: #34d399; }

        pre {
            padding: 16px 18px 18px;
            font-family: "IBM Plex Mono", ui-monospace, monospace;
            font-size: 13px;
            line-height: 1.7;
            color: #9ae6b4;
            overflow-x: auto;
        }

        .k { color: #6ee7b7; }
        .s { color: #fde68a; }
        .n { color: #93c5fd; }

        footer {
            margin-top: 18px;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            color: var(--muted);
            font-size: 12px;
        }

        @media (max-width: 640px) {
            .card { padding: 28px 20px 22px; border-radius: 22px; }
            .stats { grid-template-columns: 1fr; }
            .top { flex-direction: column; align-items: flex-start; }
            footer { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="grid"></div>
    <div class="orb orb-a"></div>
    <div class="orb orb-b"></div>

    <main class="wrap">
        <section class="card">
            <div class="top">
                <div class="brand">
                    <div class="mark">M2</div>
                    <div>
                        <small>Backend Service</small>
                        <strong>MAN 2 Kota Madiun</strong>
                    </div>
                </div>
                <div class="live"><span class="dot"></span> Operational</div>
            </div>

            <h1>API is <span>ON</span></h1>
            <p class="sub">Layanan REST backend berjalan normal. Endpoint siap menerima request dari frontend.</p>

            <div class="stats">
                <div class="stat">
                    <label>Status</label>
                    <b>200 · healthy</b>
                </div>
                <div class="stat">
                    <label>Environment</label>
                    <b>{{ app()->environment() }}</b>
                </div>
                <div class="stat">
                    <label>Laravel</label>
                    <b>v{{ app()->version() }}</b>
                </div>
            </div>

            <div class="term">
                <div class="term-bar">
                    <span class="c c1"></span>
                    <span class="c c2"></span>
                    <span class="c c3"></span>
                    <span style="margin-left:8px">GET /health</span>
                </div>
                <pre>{
  <span class="k">"ok"</span>: <span class="n">true</span>,
  <span class="k">"message"</span>: <span class="s">"API is ON"</span>,
  <span class="k">"service"</span>: <span class="s">"MAN 2 Kota Madiun"</span>,
  <span class="k">"time"</span>: <span class="s">"{{ now()->toIso8601String() }}"</span>
}</pre>
            </div>

            <footer>
                <span>PHP {{ PHP_VERSION }}</span>
                
            </footer>
        </section>
    </main>
</body>
</html>
