<main class="hero">
  <header class="hero-header">
    <div class="logo-row">
      <span class="logo-text">Studdy Buddy</span>
    </div>
    <nav class="hero-nav">
      <a href="#">Personalized</a>
      <a href="#">AI Summaries</a>
      <a href="#">Daily Streaks</a>
      <a href="#">Study Material</a>
      <button class="nav-btn login">Log in</button>
      <button class="nav-btn cta">Try for free</button>
    </nav>
  </header>
  <section class="hero-main">
    <div class="hero-rocket">
      <svg width="140" height="140" viewBox="0 0 120 120" fill="none"
        ><g fill="#111"
          ><path
            d="M60 20c-8 0-16 6-20 14-6 12-4 28 6 38l14-14 14 14c10-10 12-26 6-38-4-8-12-14-20-14zm0 18a6 6 0 110 12 6 6 0 010-12z"
          /><path d="M60 72l-10 10c2 2 6 4 10 4s8-2 10-4l-10-10z" /></g
        ></svg
      >
    </div>
    <div class="explore">
      <h1>Elevate your study game<br />with AI assistance</h1>
      <button class="hero-getstarted">Get started</button>
    </div>
  </section>
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  .hero {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    background: #fff;
  }
  .hero-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 2vw;
    border-bottom: 1.5px solid #f3f4f6;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 1.2rem;
  }
  .hero-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }
  .hero-nav a {
    text-decoration: none;
    font-weight: 600;
    color: #111;
    font-size: large;
    font: bold;
    font-size: 1rem;
    transition: color 0.2s;
  }
  .hero-nav a:hover {
    color: #5d5e8f;
    transform: translateX(2px);
  }
  .nav-btn {
    background: #111;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1.1rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  .nav-btn.cta {
    background: #fff;
    color: #111;
    border: 1.5px solid #111;
  }
  .nav-btn.cta:hover {
    background: #f3f4f6;
  }
  .nav-btn.login:hover {
    background: #6366f1;
  }
  .hero-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2vw;
  }
  .hero-rocket {
    margin-bottom: 2rem;
  }
  .hero-main h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    margin-bottom: 2rem;
    line-height: 1.15;
  }
  .hero-getstarted {
    background: #111;
    color: #fff;
    border: none;
    border-radius: 0.75rem;
    padding: 0.7rem 2.2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 1.5rem;
  }
  .hero-getstarted:hover {
    background: #6366f1;
    box-shadow: 2px 2px 4px rgba(82, 69, 69, 0.2);
    transform: translateY(-2px);
  }
  @media (max-width: 700px) {
    .hero-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
  .explore {
    text-align: center;
    color: #111;
  }
</style>
