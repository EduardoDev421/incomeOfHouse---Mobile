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
  KeyboardAvoidingView,
  Platform,
  Share,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dependencias OPCIONAIS (a tela funciona mesmo sem elas):
//   npx expo install expo-clipboard react-native-svg
//   npm install react-native-qrcode-svg
// Sem expo-clipboard, o botao "Copiar" abre o menu de compartilhar.
// Sem react-native-qrcode-svg, o QR Code nao aparece (use a chave manual).
let Clipboard = null;
try {
  Clipboard = require('expo-clipboard');
} catch (e) {}

let QRCode = null;
try {
  QRCode = require('react-native-qrcode-svg').default;
} catch (e) {}

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
  danger: '#e5484d',
};

// Ajuste as rotas conforme os nomes dos arquivos em src/app
const MENU = [
  { label: 'Meu Perfil', icon: 'person-circle-outline', route: '/perfilProfissional' },
  { label: 'Meus Endereços', icon: 'location-outline', route: '/meusEnderecos' },
  { label: 'Meus Pedidos', icon: 'grid-outline', route: '/meusPedidos' },
  { label: 'Meus Profissionais Favoritos', icon: 'star-outline', route: '/meusProfissionais' },
  { label: 'Projetos Salvos', icon: 'bookmark-outline', route: '/projetosSalvos' },
  { label: 'Agendamentos', icon: 'calendar-outline', route: '/agendamentos' },
  { label: 'Mensagem', icon: 'chatbox-ellipses-outline', route: '/mensagem' },
  { label: 'Configurações', icon: 'settings-outline', route: '/configuracoesProfissionais', ativo: true },
  { label: 'Sair', icon: 'log-out-outline', route: '/login', separador: true },
];

const LINKS_TOPO = [
  ['Início', '/'],
  ['Plantas', '/planta'],
  ['Profissionais', '/profissionais'],
  ['Sobre Nós', '/sobre'],
];

const ROTA_CONFIGURACOES = '/configuracoesProfissionais';
const EMAIL_USUARIO = 'joao@exemplo.com'; // troque pelo e-mail real do usuário
const CODIGO_DEMO = '123456'; // TODO: remover e validar o código no backend

const METODOS = [
  {
    id: 'app',
    icon: 'phone-portrait-outline',
    titulo: 'Aplicativo autenticador',
    desc: 'Google Authenticator ou Microsoft Authenticator.',
  },
  {
    id: 'email',
    icon: 'mail-outline',
    titulo: 'E-mail',
    desc: 'Receba o código de verificação no seu e-mail.',
  },
];

const ETAPAS = ['1. Configurar', '2. Verificar', '3. Códigos de backup'];

/* ---------- Funções utilitárias ---------- */

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function gerarChave() {
  let chave = '';
  for (let i = 0; i < 16; i++) chave += BASE32[Math.floor(Math.random() * BASE32.length)];
  return chave;
}

function formatarChave(chave) {
  return chave.match(/.{1,4}/g).join(' ');
}

function gerarCodigosBackup() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const pedaco = () => Array.from({ length: 4 }, () => alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('');
  return Array.from({ length: 8 }, () => `${pedaco()}-${pedaco()}`);
}

function mascararEmail(email) {
  const [usuario, dominio] = email.split('@');
  return `${usuario[0]}${'•'.repeat(Math.max(usuario.length - 1, 3))}@${dominio}`;
}

/* ---------- Tela ---------- */

export default function AutenticacaoDuasEtapas() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  // Painel principal
  const [ativo, setAtivo] = useState(true);
  const [metodo, setMetodo] = useState('app');
  const [metodoConfigurado, setMetodoConfigurado] = useState(null);

  // Assistente
  const [assistente, setAssistente] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [chave, setChave] = useState(gerarChave);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [erro, setErro] = useState('');
  const [codigos, setCodigos] = useState([]);
  const [confirmou, setConfirmou] = useState(false);
  const otpRefs = useRef([]);

  // Toast
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const mostrarToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  };

  const ir = (route) => {
    setMenuAberto(false);
    router.push(route);
  };

  const voltarConfig = () => router.push(ROTA_CONFIGURACOES);

  /* ----- Painel principal ----- */
  const salvar = () => {
    if (!ativo) {
      setMetodoConfigurado(null);
      mostrarToast('Autenticação em duas etapas desativada.');
      return;
    }
    if (metodoConfigurado === metodo) {
      mostrarToast('Nenhuma alteração para salvar.');
      return;
    }
    // Abre o assistente
    setChave(gerarChave());
    setOtp(['', '', '', '', '', '']);
    setErro('');
    setConfirmou(false);
    setEtapa(1);
    setAssistente(true);
  };

  /* ----- Assistente ----- */
  const fecharAssistente = () => setAssistente(false);

  const copiar = async (texto, mensagem) => {
    if (Clipboard && Clipboard.setStringAsync) {
      await Clipboard.setStringAsync(texto);
      mostrarToast(mensagem);
    } else {
      try {
        await Share.share({ message: texto });
      } catch (e) {}
    }
  };

  const copiarChave = () => copiar(chave, 'Chave copiada.');

  const copiarCodigos = () => copiar(codigos.join('\n'), 'Códigos copiados.');

  const irEtapa2 = () => {
    setOtp(['', '', '', '', '', '']);
    setErro('');
    setEtapa(2);
  };

  const alterarOtp = (indice, texto) => {
    const digitos = texto.replace(/\D/g, '');
    setErro('');

    if (digitos.length > 1) {
      // colar código completo
      const novo = ['', '', '', '', '', ''];
      digitos
        .slice(0, 6)
        .split('')
        .forEach((d, i) => (novo[i] = d));
      setOtp(novo);
      otpRefs.current[Math.min(digitos.length, 6) - 1]?.focus();
      return;
    }

    const novo = [...otp];
    novo[indice] = digitos;
    setOtp(novo);
    if (digitos && indice < 5) otpRefs.current[indice + 1]?.focus();
  };

  const teclaOtp = (indice, tecla) => {
    if (tecla === 'Backspace' && !otp[indice] && indice > 0) {
      const novo = [...otp];
      novo[indice - 1] = '';
      setOtp(novo);
      otpRefs.current[indice - 1]?.focus();
    }
  };

  const reenviar = () => {
    setOtp(['', '', '', '', '', '']);
    setErro('');
    otpRefs.current[0]?.focus();
    mostrarToast('Código reenviado para o seu e-mail.');
  };

  const codigoCompleto = otp.every((d) => d !== '');

  const verificar = () => {
    // TODO: validar o código no backend
    if (otp.join('') !== CODIGO_DEMO) {
      setErro('Código inválido. Tente novamente.');
      return;
    }
    setCodigos(gerarCodigosBackup());
    setConfirmou(false);
    setEtapa(3);
  };

  const ativarProtecao = () => {
    setMetodoConfigurado(metodo);
    setAssistente(false);
    mostrarToast('Autenticação em duas etapas ativada.');
  };

  /* ---------- Render ---------- */
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

        <View style={styles.topoAcoes}>
          <TouchableOpacity style={styles.topoBtnPeq} onPress={() => mostrarToast('Sem novas notificações.')}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.gold} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={() => ir('/perfilProfissional')}>
            <Ionicons name="person" size={16} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuTopo}>
        {LINKS_TOPO.map(([label, route]) => (
          <TouchableOpacity key={label} onPress={() => ir(route)}>
            <Text style={styles.menuTopoTxt}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.voltar} onPress={voltarConfig} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={16} color={COLORS.gold} />
            <Text style={styles.voltarTxt}>Voltar para configurações</Text>
          </TouchableOpacity>

          <View style={styles.tituloRow}>
            <Ionicons name="shield-checkmark-outline" size={26} color={COLORS.gold} />
            <Text style={styles.h1}>Autenticação em duas etapas</Text>
          </View>
          <Text style={styles.sub}>Aumente a segurança da sua conta.</Text>
          <View style={styles.divisor} />

          {!assistente ? (
            /* ========== PAINEL PRINCIPAL ========== */
            <View style={styles.card}>
              <View style={styles.secaoTitulo}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.gold} />
                <Text style={styles.secaoTituloTxt}>Segurança extra</Text>
              </View>

              <View style={styles.linha}>
                <View style={styles.flex}>
                  <Text style={styles.linhaTitulo}>Verificação em duas etapas</Text>
                  <Text style={styles.linhaDesc}>
                    A autenticação em duas etapas adiciona uma camada extra de proteção à sua conta.
                  </Text>
                </View>
                <Switch
                  value={ativo}
                  onValueChange={setAtivo}
                  trackColor={{ false: '#2a2a2a', true: COLORS.gold }}
                  thumbColor="#fff"
                />
              </View>

              <View style={[styles.secaoTitulo, { marginTop: 18 }]}>
                <Ionicons name="phone-portrait-outline" size={18} color={COLORS.gold} />
                <Text style={styles.secaoTituloTxt}>Método de autenticação</Text>
              </View>

              {METODOS.map((m) => {
                const selecionado = metodo === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.opcao, selecionado && styles.opcaoAtiva, !ativo && { opacity: 0.5 }]}
                    onPress={() => ativo && setMetodo(m.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.radio, selecionado && styles.radioAtivo]}>
                      {selecionado && <View style={styles.radioPonto} />}
                    </View>
                    <Ionicons name={m.icon} size={20} color={COLORS.gold} />
                    <View style={styles.flex}>
                      <Text style={styles.linhaTitulo}>{m.titulo}</Text>
                      <Text style={styles.linhaDesc}>{m.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity style={styles.btnPrincipal} onPress={salvar} activeOpacity={0.85}>
                <Text style={styles.btnPrincipalTxt}>Salvar alterações</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ========== ASSISTENTE ========== */
            <View style={styles.card}>
              <View style={styles.secaoTitulo}>
                <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.gold} />
                <Text style={[styles.secaoTituloTxt, styles.flex]}>Configurar autenticação em duas etapas</Text>
              </View>

              {/* Progresso */}
              <View style={styles.progresso}>
                {ETAPAS.map((label, i) => {
                  const n = i + 1;
                  const feito = n < etapa;
                  const atual = n === etapa;
                  return (
                    <View key={label} style={styles.progressoItem}>
                      <View style={[styles.progressoBarra, (feito || atual) && styles.progressoBarraAtiva]} />
                      <View style={styles.progressoLabelRow}>
                        {feito && <Ionicons name="checkmark" size={11} color={COLORS.gold} />}
                        <Text style={[styles.progressoTxt, (feito || atual) && { color: COLORS.gold }]}>{label}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Etapa 1 */}
              {etapa === 1 && (
                <View>
                  {metodo === 'app' ? (
                    <View>
                      <Text style={styles.etapaTitulo}>Escaneie o QR Code</Text>
                      <Text style={styles.etapaDesc}>Abra o aplicativo autenticador e adicione uma nova conta.</Text>

                      {QRCode ? (
                        <View style={styles.qrBox}>
                          <QRCode
                            value={`otpauth://totp/IncomeOfHouses:${EMAIL_USUARIO}?secret=${chave}&issuer=IncomeOfHouses`}
                            size={160}
                            backgroundColor="#ffffff"
                            color="#000000"
                          />
                        </View>
                      ) : (
                        <View style={styles.qrFallback}>
                          <Ionicons name="qr-code-outline" size={40} color={COLORS.gold} />
                          <Text style={styles.qrFallbackTxt}>
                            QR Code indisponível. Use a chave manual abaixo no aplicativo autenticador.
                          </Text>
                        </View>
                      )}

                      <View style={styles.chaveArea}>
                        <Text style={styles.chaveTitulo}>Não consegue escanear?</Text>
                        <Text style={styles.etapaDesc}>Digite esta chave no aplicativo:</Text>
                        <View style={styles.chaveRow}>
                          <Text style={styles.chaveTxt} selectable>
                            {formatarChave(chave)}
                          </Text>
                          <TouchableOpacity style={styles.btnPeq} onPress={copiarChave}>
                            <Text style={styles.btnPeqTxt}>Copiar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.etapaTitulo}>Confirme seu e-mail</Text>
                      <Text style={styles.etapaDesc}>
                        Vamos enviar um código de 6 dígitos para o e-mail cadastrado na sua conta.
                      </Text>
                      <View style={styles.avisoEmail}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.gold} />
                        <Text style={styles.avisoEmailTxt}>{mascararEmail(EMAIL_USUARIO)}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.acoes}>
                    <TouchableOpacity style={[styles.btn, styles.flex]} onPress={fecharAssistente}>
                      <Text style={styles.btnTxt}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnPrincipal, styles.flex, { marginTop: 0 }]} onPress={irEtapa2}>
                      <Text style={styles.btnPrincipalTxt}>Continuar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Etapa 2 */}
              {etapa === 2 && (
                <View>
                  <Text style={styles.etapaTitulo}>Digite o código de 6 dígitos</Text>
                  <Text style={styles.etapaDesc}>
                    {metodo === 'app'
                      ? 'Abra o aplicativo autenticador e digite o código exibido para a sua conta.'
                      : `Enviamos um código para ${mascararEmail(EMAIL_USUARIO)}.`}
                  </Text>

                  <View style={styles.otpRow}>
                    {otp.map((d, i) => (
                      <TextInput
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        style={[styles.otpInput, d !== '' && styles.otpInputPreenchido, !!erro && styles.otpInputErro]}
                        value={d}
                        onChangeText={(t) => alterarOtp(i, t)}
                        onKeyPress={({ nativeEvent }) => teclaOtp(i, nativeEvent.key)}
                        keyboardType="number-pad"
                        maxLength={6}
                        textContentType="oneTimeCode"
                        selectTextOnFocus
                        autoFocus={i === 0}
                      />
                    ))}
                  </View>

                  {!!erro && <Text style={styles.erro}>{erro}</Text>}

                  {metodo === 'email' && (
                    <TouchableOpacity onPress={reenviar} style={styles.reenviar}>
                      <Text style={styles.reenviarTxt}>Reenviar código</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.acoes}>
                    <TouchableOpacity style={[styles.btn, styles.flex]} onPress={() => setEtapa(1)}>
                      <Text style={styles.btnTxt}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnPrincipal, styles.flex, { marginTop: 0 }, !codigoCompleto && styles.btnDesabilitado]}
                      onPress={verificar}
                      disabled={!codigoCompleto}
                    >
                      <Text style={styles.btnPrincipalTxt}>Verificar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Etapa 3 */}
              {etapa === 3 && (
                <View>
                  <Text style={styles.etapaTitulo}>Guarde seus códigos de backup</Text>
                  <Text style={styles.etapaDesc}>
                    Se perder o acesso ao seu método de verificação, cada código abaixo pode ser usado uma única vez
                    para entrar na conta.
                  </Text>

                  <View style={styles.codigosGrid}>
                    {codigos.map((c) => (
                      <View key={c} style={styles.codigoItem}>
                        <Text style={styles.codigoTxt}>{c}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.btn} onPress={copiarCodigos}>
                    <Ionicons name="copy-outline" size={14} color={COLORS.gold} />
                    <Text style={styles.btnTxt}>Copiar códigos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.confirma} onPress={() => setConfirmou((v) => !v)} activeOpacity={0.8}>
                    <Ionicons
                      name={confirmou ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={confirmou ? COLORS.gold : COLORS.muted}
                    />
                    <Text style={styles.confirmaTxt}>Guardei meus códigos em um lugar seguro</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnPrincipal, !confirmou && styles.btnDesabilitado]}
                    onPress={ativarProtecao}
                    disabled={!confirmou}
                  >
                    <Text style={styles.btnPrincipalTxt}>Ativar proteção</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Rodapé */}
          <View style={styles.rodape}>
            <Text style={styles.rodapeTxt}>©IncomeOfHouses. Todos os direitos reservados.</Text>
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
      </KeyboardAvoidingView>

      {/* Toast */}
      {!!toast && (
        <View style={styles.toast} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} />
          <Text style={styles.toastTxt}>{toast}</Text>
        </View>
      )}

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
  topoAcoes: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topoBtnPeq: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  voltar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  voltarTxt: { color: COLORS.gold, fontSize: 12 },
  tituloRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  h1: { color: COLORS.text, fontSize: 20, fontWeight: '700', flex: 1 },
  sub: { color: COLORS.text, fontSize: 12, marginTop: 4 },
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
  secaoTitulo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  secaoTituloTxt: { color: COLORS.text, fontSize: 14, fontWeight: '700' },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
  },
  linhaTitulo: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  linhaDesc: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 2, lineHeight: 15 },

  // Opções
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  opcaoAtiva: { borderColor: COLORS.gold, backgroundColor: 'rgba(217,165,32,0.06)' },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioAtivo: { borderColor: COLORS.gold },
  radioPonto: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.gold },

  // Botões
  btnPrincipal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 13,
    marginTop: 10,
  },
  btnPrincipalTxt: { color: '#0a0a0a', fontSize: 13, fontWeight: '700' },
  btnDesabilitado: { opacity: 0.4 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 12,
  },
  btnTxt: { color: COLORS.gold, fontSize: 13, fontWeight: '600' },
  btnPeq: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  btnPeqTxt: { color: COLORS.gold, fontSize: 11, fontWeight: '600' },
  acoes: { flexDirection: 'row', gap: 10, marginTop: 18 },

  // Progresso
  progresso: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  progressoItem: { flex: 1 },
  progressoBarra: { height: 3, borderRadius: 2, backgroundColor: COLORS.border, marginBottom: 6 },
  progressoBarraAtiva: { backgroundColor: COLORS.gold },
  progressoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  progressoTxt: { color: COLORS.muted, fontSize: 9 },

  // Etapas
  etapaTitulo: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  etapaDesc: { color: COLORS.mutedBlue, fontSize: 12, marginTop: 4, lineHeight: 17 },

  qrBox: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  qrFallback: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 18,
    marginVertical: 16,
  },
  qrFallbackTxt: { color: COLORS.mutedBlue, fontSize: 12, textAlign: 'center', lineHeight: 17 },
  chaveArea: {
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
  },
  chaveTitulo: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  chaveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  chaveTxt: {
    flex: 1,
    color: COLORS.gold,
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  avisoEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 14,
    marginTop: 16,
  },
  avisoEmailTxt: { color: COLORS.text, fontSize: 14, fontWeight: '700' },

  // OTP
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardAlt,
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    padding: 0,
  },
  otpInputPreenchido: { borderColor: COLORS.gold },
  otpInputErro: { borderColor: COLORS.danger },
  erro: { color: COLORS.danger, fontSize: 12, marginTop: 10, textAlign: 'center' },
  reenviar: { alignSelf: 'center', marginTop: 14 },
  reenviarTxt: { color: COLORS.gold, fontSize: 12, textDecorationLine: 'underline' },

  // Backup
  codigosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  codigoItem: {
    width: '48%',
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  codigoTxt: {
    color: COLORS.text,
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  confirma: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  confirmaTxt: { color: COLORS.text, fontSize: 12, flex: 1 },

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

  // Rodapé
  rodape: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    marginHorizontal: -16,
    marginTop: 6,
  },
  rodapeTxt: { color: COLORS.muted, fontSize: 10 },
  rodapeLinks: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rodapeLink: { color: COLORS.mutedBlue, fontSize: 10 },

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