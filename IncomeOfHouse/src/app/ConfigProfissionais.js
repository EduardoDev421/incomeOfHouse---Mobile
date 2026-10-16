import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const LOGO = require('../../assets/images/Logo.png');

const COLORS = {
  bg: '#0a0a0a',
  card: '#121212',
  cardAlt: '#161616',
  border: '#2a2a2a',
  gold: '#d9a520',
  goldDim: 'rgba(217,165,32,0.45)',
  text: '#ffffff',
  muted: '#8a8a8a',
  mutedBlue: '#7f9bb5',
};

// Ajuste as rotas conforme os nomes dos arquivos em src/app
const MENU = [
  { label: 'Meu Perfil', icon: 'person-circle-outline', route: '/perfilUsuario' },
  { label: 'Meus Endereços', icon: 'location-outline', route: '/meusEnderecos' },
  { label: 'Meus Pedidos', icon: 'grid-outline', route: '/meusPedidos' },
  { label: 'Meus Profissionais Favoritos', icon: 'star-outline', route: '/profissionaisFavoritos' },
  { label: 'Projetos Salvos', icon: 'bookmark-outline', route: '/projetosSalvos' },
  { label: 'Agendamentos', icon: 'calendar-outline', route: '/agendamentos' },
  { label: 'Mensagens', icon: 'chatbox-ellipses-outline', route: '/mensagem' },
  { label: 'Configurações', icon: 'settings-outline', route: '/configuracoesProfissionais', ativo: true },
  { label: 'Sair', icon: 'log-out-outline', route: '/login', separador: true },
];

const LINKS_TOPO = [
  ['Início', '/'],
  ['Plantas', '/planta'],
  ['Profissionais', '/profissionais'],
  ['Sobre', '/sobre'],
];

/* ---------- Opções dos seletores ---------- */

const TODAS = 'Todas as regiões';

const OPCOES = {
  tipos: [
    'Arquitetos',
    'Engenheiros',
    'Designers de Interiores',
    'Paisagistas',
    'Empreiteiros',
    'Eletricistas',
    'Encanadores',
    'Pintores',
  ],
  regioes: [TODAS, 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
  contato: ['E-mail', 'WhatsApp', 'Telefone', 'SMS'],
};

const TITULOS = {
  tipos: 'Tipos de profissionais',
  regioes: 'Região de atuação',
  contato: 'Forma de contato preferida',
};

/* ---------- Switches ---------- */

const NOTIFICACOES = [
  {
    key: 'recomendados',
    icon: 'sparkles-outline',
    titulo: 'Novos profissionais recomendados',
    desc: 'Receber sugestões de profissionais com base no seu perfil.',
  },
  {
    key: 'mensagens',
    icon: 'chatbox-ellipses-outline',
    titulo: 'Mensagens de profissionais',
    desc: 'Receber novas mensagens de profissionais interessados.',
  },
  {
    key: 'projetos',
    icon: 'albums-outline',
    titulo: 'Atualizações de projetos',
    desc: 'Notificações sobre o andamento dos seus projetos.',
  },
  {
    key: 'promocoes',
    icon: 'pricetag-outline',
    titulo: 'Promoções e novidades',
    desc: 'Receber ofertas especiais e novidades da plataforma.',
  },
];

const AVALIACAO = [
  {
    key: 'exigir',
    icon: 'star-outline',
    titulo: 'Exigir avaliações',
    desc: 'Avalie o profissional após cada serviço.',
  },
  {
    key: 'publicas',
    icon: 'eye-outline',
    titulo: 'Mostrar avaliações públicas',
    desc: 'Permita que suas avaliações sejam visíveis para outros usuários.',
  },
  {
    key: 'notificar',
    icon: 'notifications-outline',
    titulo: 'Notificar sobre novas avaliações',
    desc: 'Receba alertas sobre novas avaliações dos seus profissionais.',
  },
];

const DOCUMENTOS = [
  {
    key: 'documentacao',
    icon: 'document-text-outline',
    titulo: 'Verificar documentação',
    desc: 'Exigir comprovação de documentos dos profissionais.',
  },
  {
    key: 'portfolio',
    icon: 'images-outline',
    titulo: 'Verificar portfólio',
    desc: 'Solicitar portfólio de projetos anteriores.',
  },
  {
    key: 'certificacoes',
    icon: 'ribbon-outline',
    titulo: 'Verificar certificações',
    desc: 'Confirmar certificações e especializações.',
  },
];

const SWITCHES_INICIAIS = {
  recomendados: true,
  mensagens: true,
  projetos: true,
  promocoes: true,
  exigir: true,
  publicas: true,
  notificar: true,
  documentacao: true,
  portfolio: true,
  certificacoes: true,
};

/* ---------- Funções utilitárias ---------- */

const formatarNumero = (valor) => String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const somenteDigitos = (texto) => texto.replace(/\D/g, '');

/* ---------- Componentes auxiliares ---------- */

function Painel({ icon, titulo, descricao, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitulo}>
        <View style={styles.iconeCard}>
          <Ionicons name={icon} size={18} color={COLORS.gold} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.cardTituloTxt}>{titulo}</Text>
          <Text style={styles.cardDescTxt}>{descricao}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

function OpcaoSeletor({ icon, titulo, descricao, valor, onPress, ultima }) {
  return (
    <View style={[styles.opcao, ultima && styles.opcaoUltima]}>
      <View style={styles.opcaoTopo}>
        <View style={styles.opcaoIcone}>
          <Ionicons name={icon} size={18} color={COLORS.gold} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.opcaoTitulo}>{titulo}</Text>
          <Text style={styles.opcaoDesc}>{descricao}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.seletor} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.seletorTxt} numberOfLines={1}>
          {valor}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.gold} />
      </TouchableOpacity>
    </View>
  );
}

function OpcaoSwitch({ icon, titulo, descricao, valor, onChange, ultima }) {
  return (
    <View style={[styles.opcao, styles.opcaoLinha, ultima && styles.opcaoUltima]}>
      <View style={styles.opcaoIcone}>
        <Ionicons name={icon} size={18} color={COLORS.gold} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.opcaoTitulo}>{titulo}</Text>
        <Text style={styles.opcaoDesc}>{descricao}</Text>
      </View>
      <Switch
        value={valor}
        onValueChange={onChange}
        trackColor={{ false: '#2a2a2a', true: COLORS.gold }}
        thumbColor="#fff"
      />
    </View>
  );
}

function GrupoSwitches({ itens, estado, onChange }) {
  return itens.map((item, i) => (
    <OpcaoSwitch
      key={item.key}
      icon={item.icon}
      titulo={item.titulo}
      descricao={item.desc}
      valor={estado[item.key]}
      onChange={(v) => onChange(item.key, v)}
      ultima={i === itens.length - 1}
    />
  ));
}

/* ---------- Tela ---------- */

export default function ConfigProfissionais() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  // Seletores
  const [selecoes, setSelecoes] = useState({
    tipos: ['Arquitetos', 'Engenheiros', 'Designers de Interiores', 'Paisagistas'],
    regioes: [TODAS],
    contato: ['E-mail', 'WhatsApp'],
  });
  const [faixa, setFaixa] = useState({ min: '5000', max: '50000' });

  // Switches
  const [switches, setSwitches] = useState(SWITCHES_INICIAIS);

  // Modal de seleção
  const [modal, setModal] = useState(null); // 'tipos' | 'regioes' | 'contato' | 'faixa' | null
  const [rascunho, setRascunho] = useState([]);
  const [faixaRascunho, setFaixaRascunho] = useState({ min: '', max: '' });

  // Toast
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const mostrarToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2000);
  };

  const ir = (route) => {
    setMenuAberto(false);
    router.push(route);
  };

  const alterarSwitch = (chave, valor) => {
    setSwitches((prev) => ({ ...prev, [chave]: valor }));
    mostrarToast('Preferência atualizada.');
  };

  /* ----- Resumos exibidos nos botões ----- */
  const resumo = (chave) => {
    const lista = selecoes[chave];
    if (chave === 'regioes') {
      if (lista.includes(TODAS)) return TODAS;
      return lista.length === 1 ? lista[0] : `${lista.length} regiões`;
    }
    if (chave === 'contato') {
      return lista.length === 2 ? lista.join(' e ') : lista.length === 1 ? lista[0] : `${lista.length} selecionados`;
    }
    return `${lista.length} selecionado${lista.length === 1 ? '' : 's'}`;
  };

  const resumoFaixa = `R$ ${formatarNumero(faixa.min)} — R$ ${formatarNumero(faixa.max)}`;

  /* ----- Modal ----- */
  const abrirMulti = (chave) => {
    setRascunho(selecoes[chave]);
    setModal(chave);
  };

  const abrirFaixa = () => {
    setFaixaRascunho({ min: faixa.min, max: faixa.max });
    setModal('faixa');
  };

  const alternarItem = (item) => {
    setRascunho((prev) => {
      if (modal === 'regioes') {
        if (item === TODAS) return [TODAS];
        const semTodas = prev.filter((i) => i !== TODAS);
        return semTodas.includes(item) ? semTodas.filter((i) => i !== item) : [...semTodas, item];
      }
      return prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];
    });
  };

  const confirmarMulti = () => {
    if (rascunho.length === 0) {
      Alert.alert('Seleção vazia', 'Selecione pelo menos uma opção.');
      return;
    }
    setSelecoes((prev) => ({ ...prev, [modal]: rascunho }));
    setModal(null);
    mostrarToast('Preferência atualizada.');
  };

  const confirmarFaixa = () => {
    const min = Number(faixaRascunho.min);
    const max = Number(faixaRascunho.max);
    if (!min || !max) {
      Alert.alert('Valores inválidos', 'Informe o valor mínimo e o máximo.');
      return;
    }
    if (min > max) {
      Alert.alert('Faixa inválida', 'O valor mínimo não pode ser maior que o máximo.');
      return;
    }
    setFaixa({ min: String(min), max: String(max) });
    setModal(null);
    mostrarToast('Preferência atualizada.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Topo */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => setMenuAberto(true)} style={styles.topoBtn}>
          <Ionicons name="menu" size={26} color={COLORS.gold} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => ir('/')}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => ir('/perfilUsuario')} style={styles.topoBtn}>
          <Ionicons name="person-circle-outline" size={26} color={COLORS.gold} />
        </TouchableOpacity>
      </View>

      <View style={styles.menuTopo}>
        {LINKS_TOPO.map(([label, route]) => (
          <TouchableOpacity key={label} onPress={() => ir(route)}>
            <Text style={styles.menuTopoTxt}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <View style={styles.iconeTitulo}>
            <Ionicons name="settings-outline" size={22} color={COLORS.gold} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.h1}>Configuração de Profissionais</Text>
            <Text style={styles.sub}>Gerencie as configurações relacionadas aos profissionais da sua conta.</Text>
          </View>
        </View>
        <View style={styles.divisor} />

        {/* Preferências de Contratação */}
        <Painel
          icon="person-outline"
          titulo="Preferências de Contratação"
          descricao="Defina como você deseja encontrar e contratar profissionais."
        >
          <OpcaoSeletor
            icon="people-outline"
            titulo="Tipos de profissionais"
            descricao="Selecione quais áreas deseja receber indicações."
            valor={resumo('tipos')}
            onPress={() => abrirMulti('tipos')}
          />
          <OpcaoSeletor
            icon="cash-outline"
            titulo="Faixa de preço"
            descricao="Defina o valor que está disposto a investir nos projetos."
            valor={resumoFaixa}
            onPress={abrirFaixa}
          />
          <OpcaoSeletor
            icon="location-outline"
            titulo="Região de atuação"
            descricao="Escolha as regiões onde deseja encontrar profissionais."
            valor={resumo('regioes')}
            onPress={() => abrirMulti('regioes')}
          />
          <OpcaoSeletor
            icon="chatbubbles-outline"
            titulo="Forma de contato preferida"
            descricao="Defina como prefere ser contatado pelos profissionais."
            valor={resumo('contato')}
            onPress={() => abrirMulti('contato')}
            ultima
          />
        </Painel>

        {/* Notificações */}
        <Painel
          icon="notifications-outline"
          titulo="Notificações de Profissionais"
          descricao="Escolha quais notificações deseja receber."
        >
          <GrupoSwitches itens={NOTIFICACOES} estado={switches} onChange={alterarSwitch} />
        </Painel>

        {/* Avaliação e Feedback */}
        <Painel icon="star-outline" titulo="Avaliação e Feedback" descricao="Configure como deseja avaliar os profissionais.">
          <GrupoSwitches itens={AVALIACAO} estado={switches} onChange={alterarSwitch} />
        </Painel>

        {/* Documentos e Verificações */}
        <Painel
          icon="shield-checkmark-outline"
          titulo="Documentos e Verificações"
          descricao="Gerencie as verificações dos profissionais."
        >
          <GrupoSwitches itens={DOCUMENTOS} estado={switches} onChange={alterarSwitch} />
        </Painel>

        {/* Dica */}
        <View style={styles.aviso}>
          <Ionicons name="information-circle-outline" size={22} color={COLORS.gold} />
          <Text style={styles.avisoTxt}>
            <Text style={styles.avisoNegrito}>Dica: </Text>
            Manter suas preferências atualizadas ajuda a encontrar os profissionais ideais para o seu projeto, com mais
            agilidade e segurança.
          </Text>
        </View>

        {/* Rodapé */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTxt}>© IncomeOfHouses. Todos os direitos reservados.</Text>
          <View style={styles.rodapeLinks}>
            <TouchableOpacity onPress={() => ir('/termosUso')}>
              <Text style={styles.rodapeLink}>Termos de Uso</Text>
            </TouchableOpacity>
            <Text style={styles.rodapeLink}>|</Text>
            <TouchableOpacity onPress={() => ir('/politicaPrivacidade')}>
              <Text style={styles.rodapeLink}>Política de Privacidade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Toast */}
      {!!toast && (
        <View style={styles.toast} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} />
          <Text style={styles.toastTxt}>{toast}</Text>
        </View>
      )}

      {/* Modal: seleção múltipla */}
      <Modal
        visible={modal !== null && modal !== 'faixa'}
        transparent
        animationType="slide"
        onRequestClose={() => setModal(null)}
      >
        <Pressable style={styles.sheetOverlay} onPress={() => setModal(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitulo}>{modal && modal !== 'faixa' ? TITULOS[modal] : ''}</Text>

            <ScrollView style={{ maxHeight: 340 }}>
              {modal && modal !== 'faixa' &&
                OPCOES[modal].map((op) => {
                  const marcado = rascunho.includes(op);
                  return (
                    <TouchableOpacity
                      key={op}
                      style={[styles.sheetItem, marcado && styles.sheetItemAtivo]}
                      onPress={() => alternarItem(op)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={marcado ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={marcado ? COLORS.gold : COLORS.muted}
                      />
                      <Text style={[styles.sheetItemTxt, marcado && { color: COLORS.gold }]}>{op}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>

            <View style={styles.sheetAcoes}>
              <TouchableOpacity style={[styles.btn, styles.flex]} onPress={() => setModal(null)}>
                <Text style={styles.btnTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrincipal, styles.flex]} onPress={confirmarMulti}>
                <Text style={styles.btnPrincipalTxt}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal: faixa de preço */}
      <Modal visible={modal === 'faixa'} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.sheetOverlay} onPress={() => setModal(null)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitulo}>Faixa de preço</Text>

              <View style={styles.faixaRow}>
                <View style={styles.flex}>
                  <Text style={styles.faixaLabel}>Valor mínimo</Text>
                  <View style={styles.faixaInputBox}>
                    <Text style={styles.faixaPrefixo}>R$</Text>
                    <TextInput
                      style={styles.faixaInput}
                      value={faixaRascunho.min}
                      onChangeText={(t) => setFaixaRascunho((p) => ({ ...p, min: somenteDigitos(t) }))}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.faixaLabel}>Valor máximo</Text>
                  <View style={styles.faixaInputBox}>
                    <Text style={styles.faixaPrefixo}>R$</Text>
                    <TextInput
                      style={styles.faixaInput}
                      value={faixaRascunho.max}
                      onChangeText={(t) => setFaixaRascunho((p) => ({ ...p, max: somenteDigitos(t) }))}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.sheetAcoes}>
                <TouchableOpacity style={[styles.btn, styles.flex]} onPress={() => setModal(null)}>
                  <Text style={styles.btnTxt}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnPrincipal, styles.flex]} onPress={confirmarFaixa}>
                  <Text style={styles.btnPrincipalTxt}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Menu lateral */}
      <Modal visible={menuAberto} transparent animationType="fade" onRequestClose={() => setMenuAberto(false)}>
        <View style={styles.modalRoot}>
          <SafeAreaView style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <TouchableOpacity onPress={() => setMenuAberto(false)}>
                <Ionicons name="close" size={24} color={COLORS.gold} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {MENU.map((item) => (
                <View key={item.label}>
                  {item.separador && <View style={styles.drawerSep} />}
                  <TouchableOpacity
                    style={[styles.menuItem, item.ativo && styles.menuItemAtivo]}
                    onPress={() => ir(item.route)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={item.icon} size={16} color={item.ativo ? COLORS.gold : COLORS.muted} />
                    <Text style={[styles.menuItemTxt, item.ativo && { color: COLORS.gold }]}>{item.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
          <Pressable style={styles.overlay} onPress={() => setMenuAberto(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },

  // Topo
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldDim,
  },
  topoBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 80, height: 40 },
  menuTopo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuTopoTxt: { color: COLORS.text, fontSize: 12, fontWeight: '600' },

  scroll: { padding: 16, paddingBottom: 0 },

  // Cabeçalho
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconeTitulo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: { color: COLORS.text, fontSize: 19, fontWeight: '700' },
  sub: { color: COLORS.mutedBlue, fontSize: 12, marginTop: 2, lineHeight: 16 },
  divisor: { height: 1, backgroundColor: COLORS.text, marginVertical: 12, opacity: 0.9 },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  cardTitulo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  iconeCard: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTituloTxt: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  cardDescTxt: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 2, lineHeight: 15 },

  // Opções
  opcao: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  opcaoLinha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  opcaoUltima: { borderBottomWidth: 0, paddingBottom: 4 },
  opcaoTopo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  opcaoIcone: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoTitulo: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  opcaoDesc: { color: COLORS.mutedBlue, fontSize: 10, marginTop: 2, lineHeight: 14 },

  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 48,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
  },
  seletorTxt: { color: COLORS.text, fontSize: 12, fontWeight: '600', flex: 1 },

  // Aviso
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(217,165,32,0.06)',
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  avisoTxt: { flex: 1, color: COLORS.mutedBlue, fontSize: 12, lineHeight: 17 },
  avisoNegrito: { color: COLORS.gold, fontWeight: '700' },

  // Rodapé
  rodape: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    marginHorizontal: -16,
  },
  rodapeTxt: { color: COLORS.muted, fontSize: 10 },
  rodapeLinks: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rodapeLink: { color: COLORS.mutedBlue, fontSize: 10 },

  // Toast
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  toastTxt: { color: COLORS.text, fontSize: 12, flex: 1 },

  // Bottom sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderColor: COLORS.goldDim,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 14,
  },
  sheetTitulo: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  sheetItemAtivo: { backgroundColor: 'rgba(217,165,32,0.08)' },
  sheetItemTxt: { color: COLORS.text, fontSize: 13 },
  sheetAcoes: { flexDirection: 'row', gap: 10, marginTop: 14 },

  // Faixa de preço
  faixaRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  faixaLabel: { color: COLORS.text, fontSize: 11, marginBottom: 6 },
  faixaInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
  },
  faixaPrefixo: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
  faixaInput: { flex: 1, color: COLORS.text, fontSize: 14, padding: 0 },

  // Botões
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 12,
  },
  btnTxt: { color: COLORS.gold, fontSize: 13, fontWeight: '600' },
  btnPrincipal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 12,
  },
  btnPrincipalTxt: { color: '#0a0a0a', fontSize: 13, fontWeight: '700' },

  // Drawer
  modalRoot: { flex: 1, flexDirection: 'row' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  drawer: {
    width: 260,
    backgroundColor: COLORS.bg,
    borderRightWidth: 1,
    borderRightColor: COLORS.goldDim,
    paddingHorizontal: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 6,
  },
  drawerSep: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  menuItemAtivo: { borderColor: COLORS.gold, backgroundColor: 'rgba(217,165,32,0.08)' },
  menuItemTxt: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
});