/* LUNYA — Apresentação de funcionalidades + scroll reveal */
(function(){
  "use strict";

  const W=924, H=540;
  const LX=-30, RX=W+30;   // label anchors in left / right gutters

  // ── Dados das pranchas · t=[alvo] na imagem 924×540, side l/r, ay=altura do rótulo ──
  const PLATES = [
    {
      code:"Visão geral", id:"dashboard", title:"Dashboard", img:"plates/dashboard.png",
      desc:"Visão geral do mês — KPIs, fluxo de caixa, faturas e lançamentos previstos.",
      specs:["5 KPIs do mês","Fluxo de caixa · 30 dias","Por categoria · donut","Próximas faturas","Receitas/despesas previstas","Período mês / 7D / 30D / 90D"],
      callouts:[
        {n:1,t:[250,108],side:"l",ay:148,ct:"Indicadores do mês",cs:"5 KPIs · saldo, receitas, despesas, líquido"},
        {n:2,t:[380,250],side:"l",ay:395,ct:"Fluxo de caixa",cs:"Receitas, despesas e saldo · diário"},
        {n:3,t:[790,250],side:"r",ay:175,ct:"Receitas e despesas previstas",cs:"Lançamentos fixos do mês"},
        {n:4,t:[535,432],side:"r",ay:435,ct:"Próximas faturas",cs:"Fatura em aberto por cartão"}
      ]
    },
    {
      code:"Saldos", id:"conta", title:"Conta", img:"plates/conta.png",
      desc:"Todas as contas e cartões num só lugar, com saldo, patrimônio e fatura consolidados.",
      specs:["Saldo total + patrimônio","Contas bancárias e digitais","Contas-cartão e faturas","Subcontas e cotas","Multi-instituição"],
      callouts:[
        {n:1,t:[430,128],side:"r",ay:150,ct:"Resumo consolidado",cs:"Saldo, patrimônio e fatura aberta"},
        {n:2,t:[262,228],side:"l",ay:215,ct:"Contas bancárias",cs:"Saldo disponível por instituição"},
        {n:3,t:[262,418],side:"l",ay:430,ct:"Contas-cartão",cs:"Fatura atual de cada cartão"}
      ]
    },
    {
      code:"Carteira", id:"investimentos", title:"Investimentos", img:"plates/investimentos.png",
      desc:"Acompanhe patrimônio aplicado, rendimento e vencimentos de cada posição.",
      specs:["Patrimônio aplicado","Rendimento e rentabilidade","Renda fixa · tesouro · fundos","Cripto · ações · poupança","Alerta de vencimento"],
      callouts:[
        {n:1,t:[250,90],side:"l",ay:160,ct:"Patrimônio aplicado",cs:"Valor atual vs. aportado"},
        {n:2,t:[600,86],side:"r",ay:150,ct:"Posição detalhada",cs:"Rendimento, taxa e liquidez"},
        {n:3,t:[620,250],side:"r",ay:405,ct:"Carteira de ativos",cs:"Aplicado · atual · rendimento"},
        {n:4,t:[250,330],side:"l",ay:405,ct:"Lista de posições",cs:"Selecione para detalhar"}
      ]
    },
    {
      code:"Faturas", id:"cartoes", title:"Cartões", img:"plates/cartoes.png",
      desc:"Faturas, limites e lançamentos dos seus cartões — com importação e parcelamento.",
      specs:["Deck de cartões","Fatura aberta · vencimento","Limite usado / disponível","Lançamentos e conciliação","Importar fatura · parcelas"],
      callouts:[
        {n:1,t:[300,178],side:"l",ay:165,ct:"Seus cartões",cs:"Fatura atual por cartão"},
        {n:2,t:[300,302],side:"l",ay:405,ct:"Fatura aberta",cs:"Fechamento e vencimento"},
        {n:3,t:[772,300],side:"r",ay:215,ct:"Limite do cartão",cs:"Usado · disponível · total"},
        {n:4,t:[560,470],side:"r",ay:430,ct:"Lançamentos",cs:"Conciliados e parcelados"}
      ]
    },
    {
      code:"Histórico", id:"transacoes", title:"Transações", img:"plates/transacoes.png",
      desc:"Histórico completo com filtros, navegação por mês e importação de extratos OFX.",
      specs:["Lista agrupada por dia","Filtros · período / conta / status","Situação do período","Importação OFX / QFX","Totais do período"],
      callouts:[
        {n:1,t:[250,250],side:"l",ay:200,ct:"Situação do período",cs:"Previsto vs. confirmado"},
        {n:2,t:[250,398],side:"l",ay:430,ct:"Importar extrato",cs:"OFX / QFX sem duplicar"},
        {n:3,t:[642,200],side:"r",ay:185,ct:"Movimentações por dia",cs:"Status, categoria e conta"},
        {n:4,t:[642,498],side:"r",ay:455,ct:"Totais do período",cs:"Entradas, saídas e resultado"}
      ]
    },
    {
      code:"Limites", id:"orcamentos", title:"Orçamentos", img:"plates/orcamentos.png",
      desc:"Defina limites por categoria e acompanhe o consumo conforme os gastos entram.",
      specs:["Planejado / consumido / disponível","Limite por categorias","Alerta configurável (%)","Status do orçamento","Transações e cartões"],
      callouts:[
        {n:1,t:[440,130],side:"r",ay:155,ct:"Métricas do mês",cs:"Planejado, consumido e alertas"},
        {n:2,t:[320,196],side:"l",ay:175,ct:"Consumo geral",cs:"Progresso mensal dos limites"},
        {n:3,t:[262,392],side:"l",ay:420,ct:"Novo orçamento",cs:"Valor, alerta e categorias"},
        {n:4,t:[662,300],side:"r",ay:405,ct:"Orçamentos ativos",cs:"Gasto vs. limite por categoria"}
      ]
    }
  ];

  const pct=(v,max)=> (v/max*100);
  function anchorOf(c){ return [ c.side==="l"?LX:RX, c.ay ]; }
  function dist(a,b){ return Math.hypot(a[0]-b[0],a[1]-b[1]); }

  // architectural slash tick (45°)
  function tick(x,y){ const s=6; return `<line class="tick" x1="${x-s}" y1="${y+s}" x2="${x+s}" y2="${y-s}"/>`; }

  function buildSVG(p){
    const yD=-42, xD=-50;
    let s=`<svg class="anno" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
    // top width dimension
    s+=`<line class="tick" x1="0" y1="-6" x2="0" y2="${yD}"/><line class="tick" x1="${W}" y1="-6" x2="${W}" y2="${yD}"/>`;
    s+=`<line class="dim" style="--len:${W}" x1="0" y1="${yD}" x2="${W}" y2="${yD}"/>`+tick(0,yD)+tick(W,yD);
    s+=`<text class="dimtxt" x="${W/2}" y="${yD-7}" text-anchor="middle">1440 PX</text>`;
    // left height dimension
    s+=`<line class="tick" x1="-6" y1="0" x2="${xD}" y2="0"/><line class="tick" x1="-6" y1="${H}" x2="${xD}" y2="${H}"/>`;
    s+=`<line class="dim" style="--len:${H}" x1="${xD}" y1="0" x2="${xD}" y2="${H}"/>`+tick(xD,0)+tick(xD,H);
    s+=`<text class="dimtxt" x="${xD-8}" y="${H/2}" text-anchor="middle" transform="rotate(-90 ${xD-8} ${H/2})">900 PX</text>`;
    // leaders + target dots
    p.callouts.forEach(c=>{
      const a=anchorOf(c), L=dist(c.t,a)+2;
      s+=`<line class="lead" style="--len:${L}" x1="${c.t[0]}" y1="${c.t[1]}" x2="${a[0]}" y2="${a[1]}"/>`;
      s+=`<circle class="dot" cx="${c.t[0]}" cy="${c.t[1]}" r="3.4"/>`;
      s+=`<circle class="dot" cx="${c.t[0]}" cy="${c.t[1]}" r="7" fill="none" stroke="var(--lime)" stroke-width="1" opacity=".5"/>`;
    });
    return s+`</svg>`;
  }

  function buildCallouts(p){
    return p.callouts.map(c=>{
      const a=anchorOf(c), left=pct(a[0],W), top=pct(a[1],H);
      const tf=c.side==="l"?"translate(-100%,-50%)":"translate(0,-50%)";
      const pad=c.side==="l"?"padding-right:12px;":"padding-left:12px;";
      return `<div class="callout" data-side="${c.side}" style="left:${left}%;top:${top}%;transform:${tf};${pad}">
        <div class="cn">${c.n}</div><div class="ct">${c.ct}</div><div class="cs">${c.cs}</div>
      </div>`;
    }).join("");
  }

  function titleBlock(p){
    return `<div class="titleblock plate-tb">
      <div class="tb-row">
        <div class="cell" style="grid-column:span 2;"><div class="k">Produto</div><div class="v">Lunya · Finanças</div></div>
        <div class="cell" style="grid-column:span 2;"><div class="k">Área</div><div class="v acc">${p.code}</div></div>
      </div>
      <div class="tb-row">
        <div class="cell" style="grid-column:span 2;"><div class="k">Módulo</div><div class="v">${p.title}</div></div>
        <div class="cell" style="grid-column:span 2;"><div class="k">Uso</div><div class="v">Rotina financeira</div></div>
      </div>
    </div>`;
  }

  function specBar(p){
    return `<div class="spec-bar">${p.specs.map(x=>`<span class="sb">${x}</span>`).join("")}</div>`;
  }

  function buildSection(p){
    const sec=document.createElement("section");
    sec.className="plate-section"; sec.id=p.id; sec.dataset.code=p.code;
    sec.innerHTML=`
      <div class="plate-head">
        <div class="lead"><span class="pcode">${p.code}</span><h2>${p.title}</h2></div>
        <div class="desc">${p.desc}</div>
      </div>
      ${specBar(p)}
      <div class="stage">
        <div class="plate">
          <img class="shot" src="${p.img}" alt="Lunya — ${p.title}"/>
          <span class="crop tl"></span><span class="crop tr"></span><span class="crop bl"></span><span class="crop br"></span>
          ${buildSVG(p)}
          ${buildCallouts(p)}
        </div>
        ${titleBlock(p)}
      </div>`;
    return sec;
  }

  // ── Render ──
  const mount=document.getElementById("plates");
  PLATES.forEach(p=>mount.appendChild(buildSection(p)));

  const rail=document.getElementById("rail");
  PLATES.forEach(p=>{
    const a=document.createElement("a");
    a.href="#"+p.id; a.dataset.id=p.id;
    a.innerHTML=`<span>${p.code}</span><span class="tick"></span>`;
    rail.appendChild(a);
  });

  // ── Scroll reveal + active rail ──
  const railLinks=[...rail.querySelectorAll("a")];
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add("in-view");
      if(e.intersectionRatio>0.5){
        const id=e.target.id;
        railLinks.forEach(l=>l.classList.toggle("on",l.dataset.id===id));
      }
    });
  },{threshold:[0.18,0.5]});
  document.querySelectorAll(".plate-section").forEach(s=>io.observe(s));
})();
