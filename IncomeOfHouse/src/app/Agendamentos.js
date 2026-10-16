import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';

/* ------------------------------------------------------------------ */
/* Tema (escuro + dourado, igual ao site)                              */
/* ------------------------------------------------------------------ */

const COR = {
  fundo: '#0A0A0A',
  card: '#141414',
  celula: '#0A0A0A',
  borda: '#2A2A2A',
  bordaForte: '#3A3A3A',
  dourado: '#D4A537',
  douradoFundo: '#2A2418',
  texto: '#FFFFFF',
  suave: '#8C8C8C',
  apagado: '#4A4A4A',
  erro: '#E5534B',
  ok: '#4ADE80',
};

const TIPOS = {
  visita: { rotulo: 'Visita ao imóvel', plural: 'Visitas', cor: '#D4A537' },
  reuniao: { rotulo: 'Reunião', plural: 'Reuniões', cor: '#6FA8DC' },
  entrega: { rotulo: 'Entrega de projeto', plural: 'Entregas', cor: '#4ADE80' },
  consultoria: { rotulo: 'Consultoria', plural: 'Consultorias', cor: '#B794F4' },
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_SEMANA_LONGO = [
  'Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira',
  'Quinta-Feira', 'Sexta-Feira', 'Sábado',
];

const HORA_INICIO = 8 * 60; // 08:00
const HORA_FIM = 20 * 60; // 20:00
const PASSO = 30; // minutos
const DUR_MIN = 30;
const DUR_MAX = 240;

/* ------------------------------------------------------------------ */
/* Utilitários                                                         */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, '0');
const chaveData = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const lerChave = (k) => {
  const [a, m, d] = k.split('-').map(Number);
  return new Date(a, m - 1, d);
};
const fmtHora = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const fmtDuracao = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h${pad(m)}`;
  if (h) return `${h}h`;
  return `${m} min`;
};

/* ------------------------------------------------------------------ */
/* Dados de exemplo (troque pela sua API / AsyncStorage)               */
/* ------------------------------------------------------------------ */

function dadosIniciais() {
  const hoje = new Date();
  const dia = (offset) =>
    chaveData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + offset));
  return [
    { id: '1', data: dia(1), inicio: 9 * 60, duracao: 60, titulo: 'Visita ao terreno', tipo: 'visita', prof: 'Carlos Mendes', status: 'confirmado' },
    { id: '2', data: dia(1), inicio: 14 * 60, duracao: 30, titulo: 'Alinhamento da planta', tipo: 'reuniao', prof: 'Ana Souza', status: 'pendente' },
    { id: '3', data: dia(4), inicio: 10 * 60, duracao: 90, titulo: 'Entrega do projeto', tipo: 'entrega', prof: 'Studio Lima', status: 'confirmado' },
    { id: '4', data: dia(6), inicio: 15 * 60, duracao: 60, titulo: 'Consultoria financeira', tipo: 'consultoria', prof: 'Marina Costa', status: 'pendente' },
  ];
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */

export default function Agendamentos() {
  const hoje = new Date();
  const chaveHoje = chaveData(hoje);

  const [mesRef, setMesRef] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [selecionado, setSelecionado] = useState(chaveHoje);
  const [filtro, setFiltro] = useState('todos');
  const [agendamentos, setAgendamentos] = useState(dadosIniciais);

  const [duracao, setDuracao] = useState(30);
  const [slot, setSlot] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('visita');
  const [prof, setProf] = useState('');
  const [msg, setMsg] = useState({ texto: '', ok: true });

  /* ---------- derivados ---------- */

  const visiveis = useMemo(
    () => agendamentos.filter((a) => filtro === 'todos' || a.tipo === filtro),
    [agendamentos, filtro]
  );

  const porDia = useMemo(() => {
    const mapa = {};
    visiveis.forEach((a) => {
      (mapa[a.data] = mapa[a.data] || []).push(a);
    });
    Object.values(mapa).forEach((l) => l.sort((x, y) => x.inicio - y.inicio));
    return mapa;
  }, [visiveis]);

  const celulas = useMemo(() => {
    const ano = mesRef.getFullYear();
    const mes = mesRef.getMonth();
    const primeiro = new Date(ano, mes, 1).getDay();
    const total = new Date(ano, mes + 1, 0).getDate();
    const lista = [];
    for (let i = 0; i < primeiro; i++) lista.push(null);
    for (let d = 1; d <= total; d++) lista.push(new Date(ano, mes, d));
    while (lista.length % 7 !== 0) lista.push(null);
    return lista;
  }, [mesRef]);

  const stats = useMemo(() => {
    const prefixo = `${mesRef.getFullYear()}-${pad(mesRef.getMonth() + 1)}`;
    const doMes = agendamentos.filter((a) => a.data.startsWith(prefixo));
    return {
      total: doMes.length,
      confirmados: doMes.filter((a) => a.status === 'confirmado').length,
      pendentes: doMes.filter((a) => a.status === 'pendente').length,
    };
  }, [agendamentos, mesRef]);

  const dataSel = lerChave(selecionado);
  const diaPassado = selecionado < chaveHoje;
  const compromissosDia = porDia[selecionado] || [];
  const todosDoDia = useMemo(
    () => agendamentos.filter((a) => a.data === selecionado),
    [agendamentos, selecionado]
  );

  const slots = useMemo(() => {
    const agora = new Date();
    const minAgora = agora.getHours() * 60 + agora.getMinutes();
    const lista = [];
    for (let m = HORA_INICIO; m < HORA_FIM; m += PASSO) {
      const fim = m + duracao;
      let livre = fim <= HORA_FIM && !diaPassado;
      if (livre && selecionado === chaveHoje && m <= minAgora) livre = false;
      if (livre) {
        livre = !todosDoDia.some((a) => m < a.inicio + a.duracao && fim > a.inicio);
      }
      lista.push({ inicio: m, livre });
    }
    return lista;
  }, [duracao, diaPassado, selecionado, chaveHoje, todosDoDia]);

  const livres = slots.filter((x) => x.livre).length;

  /* ---------- ações ---------- */

  const limparMsg = () => setMsg({ texto: '', ok: true });

  const mudarMes = (delta) =>
    setMesRef(new Date(mesRef.getFullYear(), mesRef.getMonth() + delta, 1));

  const escolherDia = (chave) => {
    setSelecionado(chave);
    setSlot(null);
    limparMsg();
  };

  const irParaHoje = () => {
    setMesRef(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    escolherDia(chaveHoje);
  };

  const mudarDuracao = (delta) => {
    const nova = Math.min(DUR_MAX, Math.max(DUR_MIN, duracao + delta));
    setDuracao(nova);
    if (slot !== null) {
      const fim = slot + nova;
      const conflito =
        fim > HORA_FIM || todosDoDia.some((a) => slot < a.inicio + a.duracao && fim > a.inicio);
      if (conflito) setSlot(null);
    }
    limparMsg();
  };

  const agendar = () => {
    if (slot === null) {
      setMsg({ texto: 'Escolha um horário.', ok: false });
      return;
    }
    if (!titulo.trim()) {
      setMsg({ texto: 'Informe um título para o agendamento.', ok: false });
      return;
    }
    const novo = {
      id: String(Date.now()),
      data: selecionado,
      inicio: slot,
      duracao,
      titulo: titulo.trim(),
      tipo,
      prof: prof.trim(),
      status: 'pendente',
    };
    setAgendamentos((l) => [...l, novo]);
    setTitulo('');
    setProf('');
    setSlot(null);
    setMsg({ texto: `Agendado para ${fmtHora(novo.inicio)}.`, ok: true });
  };

  const remover = (item) => {
    Alert.alert('Remover agendamento', `Remover "${item.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => setAgendamentos((l) => l.filter((a) => a.id !== item.id)),
      },
    ]);
  };

  /* ---------- render ---------- */

  const infoAgendar = diaPassado
    ? 'Este dia já passou. Escolha uma data a partir de hoje.'
    : slot !== null
    ? `${fmtHora(slot)} – ${fmtHora(slot + duracao)} (${fmtDuracao(duracao)})`
    : livres === 0
    ? 'Nenhum horário livre neste dia.'
    : `${livres} ${livres === 1 ? 'horário livre' : 'horários livres'} neste dia. Escolha um.`;

  const podeAgendar = slot !== null && !diaPassado;

  return (
    <KeyboardAvoidingView
      style={s.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COR.fundo} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Cabeçalho */}
        <View style={s.inicio}>
          <Text style={s.h1}>Agendamentos</Text>
          <Text style={s.sub}>
            Escolha o dia no calendário e marque visitas, reuniões e entregas.
          </Text>
          <Text style={s.resumo}>
            <Text style={s.resumoNum}>{stats.total}</Text> neste mês ·{' '}
            <Text style={s.resumoNum}>{stats.confirmados}</Text> confirmados ·{' '}
            <Text style={s.resumoNum}>{stats.pendentes}</Text> pendentes
          </Text>
          <View style={s.divisor} />
        </View>

        {/* Calendário */}
        <View style={s.card}>
          <View style={s.calTopo}>
            <View style={s.calNav}>
              <TouchableOpacity
                style={s.btnNav}
                onPress={() => mudarMes(-1)}
                accessibilityLabel="Mês anterior"
              >
                <Text style={s.btnNavTxt}>‹</Text>
              </TouchableOpacity>
              <Text style={s.tituloMes} numberOfLines={1}>
                {MESES[mesRef.getMonth()]} De {mesRef.getFullYear()}
              </Text>
              <TouchableOpacity
                style={s.btnNav}
                onPress={() => mudarMes(1)}
                accessibilityLabel="Próximo mês"
              >
                <Text style={s.btnNavTxt}>›</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.btnHoje} onPress={irParaHoje}>
              <Text style={s.btnHojeTxt}>Hoje</Text>
            </TouchableOpacity>
          </View>

          {/* Filtros */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filtros}
          >
            <Filtro ativo={filtro === 'todos'} rotulo="Todos" onPress={() => setFiltro('todos')} />
            {Object.entries(TIPOS).map(([chave, t]) => (
              <Filtro
                key={chave}
                ativo={filtro === chave}
                rotulo={t.plural}
                cor={t.cor}
                onPress={() => setFiltro(chave)}
              />
            ))}
          </ScrollView>

          {/* Semana */}
          <View style={s.semana}>
            {DIAS_SEMANA.map((d) => (
              <Text key={d} style={s.semanaTxt}>
                {d}
              </Text>
            ))}
          </View>

          {/* Grade */}
          <View style={s.grade}>
            {celulas.map((d, i) => {
              if (!d) return <View key={`v${i}`} style={s.celula} />;
              const chave = chaveData(d);
              const ehSel = chave === selecionado;
              const ehHoje = chave === chaveHoje;
              const passado = chave < chaveHoje;
              const itens = porDia[chave] || [];
              const tiposDoDia = [...new Set(itens.map((a) => a.tipo))].slice(0, 3);
              return (
                <TouchableOpacity
                  key={chave}
                  style={s.celula}
                  onPress={() => escolherDia(chave)}
                  accessibilityLabel={`Dia ${d.getDate()}, ${itens.length} compromissos`}
                >
                  <View
                    style={[
                      s.celulaInterna,
                      ehHoje && !ehSel && s.celulaHoje,
                      ehSel && s.celulaSel,
                    ]}
                  >
                    <View style={[s.numCirculo, ehSel && s.numCirculoSel]}>
                      <Text
                        style={[
                          s.diaNumTxt,
                          passado && s.diaNumPassado,
                          ehHoje && !ehSel && { color: COR.dourado },
                          ehSel && s.diaNumSel,
                        ]}
                      >
                        {d.getDate()}
                      </Text>
                    </View>
                    <View style={s.pontos}>
                      {tiposDoDia.map((t) => (
                        <View
                          key={t}
                          style={[s.ponto, { backgroundColor: TIPOS[t].cor }]}
                        />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dia selecionado + compromissos */}
        <View style={s.card}>
          <View style={s.diaSel}>
            <Text style={s.diaSelNum}>{dataSel.getDate()}</Text>
            <View>
              <Text style={s.diaSelSemana}>{DIAS_SEMANA_LONGO[dataSel.getDay()]}</Text>
              <Text style={s.diaSelMes}>
                {MESES[dataSel.getMonth()]} De {dataSel.getFullYear()}
              </Text>
            </View>
          </View>
          <View style={s.divisor} />

          <Text style={s.h3}>Compromissos do dia</Text>
          {compromissosDia.length === 0 ? (
            <Text style={s.vazio}>
              {filtro === 'todos'
                ? 'Nenhum compromisso neste dia.'
                : 'Nenhum compromisso deste tipo neste dia.'}
            </Text>
          ) : (
            compromissosDia.map((a) => (
              <View key={a.id} style={s.item}>
                <View style={[s.itemBarra, { backgroundColor: TIPOS[a.tipo].cor }]} />
                <View style={s.itemCorpo}>
                  <Text style={s.itemHora}>
                    {fmtHora(a.inicio)} – {fmtHora(a.inicio + a.duracao)}
                  </Text>
                  <Text style={s.itemTitulo}>{a.titulo}</Text>
                  <Text style={s.itemMeta}>
                    {TIPOS[a.tipo].rotulo}
                    {a.prof ? ` · ${a.prof}` : ''}
                  </Text>
                </View>
                <View style={s.itemDireita}>
                  <Text
                    style={[
                      s.status,
                      { color: a.status === 'confirmado' ? COR.ok : COR.dourado },
                    ]}
                  >
                    {a.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => remover(a)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={`Remover ${a.titulo}`}
                  >
                    <Text style={s.itemRemover}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={[s.divisor, { marginTop: 16 }]} />

          {/* Novo agendamento */}
          <View style={s.novoTopo}>
            <Text style={s.h3Sem}>Novo agendamento</Text>
            <View style={s.duracao}>
              <TouchableOpacity
                style={s.btnDur}
                onPress={() => mudarDuracao(-PASSO)}
                accessibilityLabel="Diminuir duração"
              >
                <Text style={s.btnDurTxt}>−</Text>
              </TouchableOpacity>
              <Text style={s.durValor}>{fmtDuracao(duracao)}</Text>
              <TouchableOpacity
                style={s.btnDur}
                onPress={() => mudarDuracao(PASSO)}
                accessibilityLabel="Aumentar duração"
              >
                <Text style={s.btnDurTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.info}>{infoAgendar}</Text>

          <View style={s.slots}>
            {slots.map((sl) => {
              const ativo = slot === sl.inicio;
              return (
                <TouchableOpacity
                  key={sl.inicio}
                  disabled={!sl.livre}
                  onPress={() => {
                    setSlot(sl.inicio);
                    limparMsg();
                  }}
                  style={[s.slot, !sl.livre && s.slotOcupado, ativo && s.slotAtivo]}
                >
                  <Text
                    style={[
                      s.slotTxt,
                      !sl.livre && s.slotTxtOcupado,
                      ativo && s.slotTxtAtivo,
                    ]}
                  >
                    {fmtHora(sl.inicio)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.label}>Título</Text>
          <TextInput
            style={s.input}
            value={titulo}
            onChangeText={(t) => {
              setTitulo(t);
              limparMsg();
            }}
            maxLength={60}
            placeholder="Ex.: Visita ao terreno"
            placeholderTextColor={COR.suave}
            selectionColor={COR.dourado}
          />

          <Text style={s.label}>Tipo</Text>
          <View style={s.tipos}>
            {Object.entries(TIPOS).map(([chave, t]) => {
              const ativo = tipo === chave;
              return (
                <TouchableOpacity
                  key={chave}
                  onPress={() => setTipo(chave)}
                  style={[
                    s.tipoChip,
                    ativo && { borderColor: t.cor, backgroundColor: COR.douradoFundo },
                  ]}
                >
                  <View style={[s.filtroPonto, { backgroundColor: t.cor }]} />
                  <Text style={[s.tipoChipTxt, ativo && { color: COR.texto, fontWeight: '600' }]}>
                    {t.rotulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.label}>Profissional</Text>
          <TextInput
            style={s.input}
            value={prof}
            onChangeText={setProf}
            maxLength={40}
            placeholder="Nome"
            placeholderTextColor={COR.suave}
            selectionColor={COR.dourado}
          />

          {!!msg.texto && (
            <Text
              accessibilityLiveRegion="polite"
              style={[s.msg, { color: msg.ok ? COR.ok : COR.erro }]}
            >
              {msg.texto}
            </Text>
          )}

          <TouchableOpacity
            style={[s.btnAgendar, !podeAgendar && s.btnAgendarOff]}
            disabled={!podeAgendar}
            onPress={agendar}
          >
            <Text style={s.btnAgendarTxt}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function Filtro({ ativo, rotulo, cor, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.filtro, ativo && s.filtroAtivo]}>
      {cor && <View style={[s.filtroPonto, { backgroundColor: cor }]} />}
      <Text style={[s.filtroTxt, ativo && s.filtroTxtAtivo]}>{rotulo}</Text>
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/* Estilos                                                             */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: COR.fundo },
  scroll: { padding: 16, paddingBottom: 48, gap: 16 },

  /* cabeçalho */
  inicio: { gap: 4 },
  h1: { fontSize: 26, fontWeight: '700', color: COR.texto },
  sub: { fontSize: 13, color: COR.suave, lineHeight: 19 },
  resumo: { fontSize: 13, color: COR.suave, marginTop: 6 },
  resumoNum: { color: COR.dourado, fontWeight: '700' },
  divisor: { height: 1, backgroundColor: COR.bordaForte, marginTop: 12, marginBottom: 4 },

  card: {
    backgroundColor: COR.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COR.borda,
  },

  /* calendário */
  calTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  calNav: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  btnNav: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COR.dourado,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNavTxt: { fontSize: 20, color: COR.dourado, lineHeight: 22 },
  tituloMes: {
    fontSize: 17,
    fontWeight: '700',
    color: COR.texto,
    textAlign: 'center',
    flexShrink: 1,
  },
  btnHoje: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COR.dourado,
  },
  btnHojeTxt: { color: COR.dourado, fontWeight: '600', fontSize: 13 },

  filtros: { gap: 8, paddingBottom: 14 },
  filtro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COR.bordaForte,
    backgroundColor: COR.fundo,
  },
  filtroAtivo: { borderColor: COR.dourado, backgroundColor: COR.douradoFundo },
  filtroPonto: { width: 8, height: 8, borderRadius: 4 },
  filtroTxt: { fontSize: 12.5, color: COR.suave },
  filtroTxtAtivo: { color: COR.dourado, fontWeight: '600' },

  semana: { flexDirection: 'row', marginBottom: 6 },
  semanaTxt: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: COR.suave,
  },
  grade: { flexDirection: 'row', flexWrap: 'wrap' },
  celula: { width: `${100 / 7}%`, aspectRatio: 0.9, padding: 2 },
  celulaInterna: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COR.borda,
    backgroundColor: COR.celula,
    alignItems: 'center',
    paddingTop: 5,
  },
  celulaHoje: { borderColor: COR.dourado },
  celulaSel: { borderColor: COR.dourado, backgroundColor: COR.douradoFundo },
  numCirculo: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numCirculoSel: { backgroundColor: COR.dourado },
  diaNumTxt: { fontSize: 12.5, color: COR.texto, fontWeight: '700' },
  diaNumPassado: { color: COR.apagado, fontWeight: '500' },
  diaNumSel: { color: '#0A0A0A' },
  pontos: { flexDirection: 'row', gap: 3, marginTop: 6 },
  ponto: { width: 6, height: 6, borderRadius: 3 },

  /* dia selecionado */
  diaSel: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  diaSelNum: { fontSize: 46, fontWeight: '700', color: COR.dourado },
  diaSelSemana: { fontSize: 17, fontWeight: '600', color: COR.texto },
  diaSelMes: { fontSize: 13, color: COR.suave, marginTop: 2 },

  h3: { fontSize: 16, fontWeight: '600', color: COR.texto, marginTop: 8, marginBottom: 10 },
  h3Sem: { fontSize: 16, fontWeight: '600', color: COR.texto },
  vazio: { fontSize: 14, color: COR.suave, paddingLeft: 4 },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COR.borda,
    backgroundColor: COR.celula,
  },
  itemBarra: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  itemCorpo: { flex: 1 },
  itemHora: { fontSize: 12, color: COR.dourado, fontWeight: '700' },
  itemTitulo: { fontSize: 15, color: COR.texto, fontWeight: '600', marginTop: 2 },
  itemMeta: { fontSize: 12, color: COR.suave, marginTop: 2 },
  itemDireita: { alignItems: 'flex-end', gap: 8 },
  status: { fontSize: 11, fontWeight: '700' },
  itemRemover: { fontSize: 12, color: COR.erro, fontWeight: '600' },

  /* novo agendamento */
  novoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  duracao: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnDur: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COR.bordaForte,
    backgroundColor: COR.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDurTxt: { fontSize: 18, color: COR.texto, lineHeight: 20 },
  durValor: {
    fontSize: 14,
    fontWeight: '700',
    color: COR.texto,
    minWidth: 52,
    textAlign: 'center',
  },
  info: { fontSize: 13, color: COR.suave, marginBottom: 12 },

  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  slot: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: COR.fundo,
    alignItems: 'center',
  },
  slotOcupado: { borderColor: COR.borda, backgroundColor: '#101010' },
  slotAtivo: { backgroundColor: COR.dourado, borderColor: COR.dourado },
  slotTxt: { fontSize: 13, color: COR.texto, fontWeight: '600' },
  slotTxtOcupado: { color: COR.apagado, textDecorationLine: 'line-through', fontWeight: '400' },
  slotTxtAtivo: { color: '#0A0A0A' },

  label: { fontSize: 13, color: COR.suave, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: COR.bordaForte,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    fontSize: 15,
    color: COR.texto,
    backgroundColor: COR.fundo,
  },
  tipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COR.bordaForte,
    backgroundColor: COR.fundo,
  },
  tipoChipTxt: { fontSize: 13, color: COR.suave },

  msg: { fontSize: 13, fontWeight: '600', marginTop: 14 },
  btnAgendar: {
    marginTop: 18,
    backgroundColor: COR.dourado,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnAgendarOff: { opacity: 0.35 },
  btnAgendarTxt: { color: '#0A0A0A', fontSize: 16, fontWeight: '700' },
});