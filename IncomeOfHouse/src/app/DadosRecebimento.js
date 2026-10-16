import React, { useState } from 'react';
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
  green: '#0e5a3a',
  greenText: '#e8fff3',
};

// Ajuste as rotas conforme os nomes dos arquivos em src/app
const MENU = [
  { label: 'Meu Perfil', icon: 'person-circle-outline', route: '/perfilProfissional' },
  { label: 'Meus Endereços', icon: 'location-outline', route: '/meusEnderecos' },
  { label: 'Meus Pedidos', icon: 'grid-outline', route: '/meusPedidos' },
  { label: 'Meus Profissionais', icon: 'star-outline', route: '/meusProfissionais' },
  { label: 'Projetos Salvos', icon: 'bookmark-outline', route: '/projetosSalvos' },
  { label: 'Agendamentos', icon: 'calendar-outline', route: '/agendamentos' },
  { label: 'Mensagem', icon: 'chatbox-ellipses-outline', route: '/mensagem' },
  { label: 'Configurações', icon: 'settings-outline', route: '/configuracoes' },
  { label: 'Dados de Recebimento', icon: 'wallet-outline', route: '/DadosRecebimento', ativo: true },
  { label: 'Sair', icon: 'log-out-outline', route: '/login', separador: true },
];

const LINKS_TOPO = [
  ['Início', '/'],
  ['Plantas', '/planta'],
  ['Profissionais', '/profissionais'],
  ['Sobre', '/sobre'],
];

const BANCOS = ['Banco do Brasil', 'Bradesco', 'Caixa Econômica', 'Itaú', 'Nubank', 'Santander', 'Inter'];
const TIPOS_CONTA = ['Conta Corrente', 'Conta Poupança', 'Conta Salário'];

const HISTORICO = [
  { id: '1', data: '15/04/2025', desc: 'Projeto Residencial', valor: 'R$ 2.450,00', status: 'Pago' },
  { id: '2', data: '10/04/2025', desc: 'Planta Baixa - Sobrado', valor: 'R$ 1.280,00', status: 'Pago' },
  { id: '3', data: '05/04/2025', desc: 'Projeto Comercial', valor: 'R$ 3.750,00', status: 'Pago' },
  { id: '4', data: '28/03/2025', desc: 'Planta Baixa - Residencial', valor: 'R$ 980,00', status: 'Pago' },
];

/* ---------- Componentes auxiliares ---------- */

function CardTitulo({ icon, titulo, descricao }) {
  return (
    <View style={styles.cardTitulo}>
      <View style={styles.iconeCard}>
        <Ionicons name={icon} size={18} color={COLORS.gold} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTituloTxt}>{titulo}</Text>
        <Text style={styles.cardDescTxt}>{descricao}</Text>
      </View>
    </View>
  );
}

function CampoSelect({ label, valor, onPress }) {
  return (
    <TouchableOpacity style={styles.campo} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="business-outline" size={16} color={COLORS.gold} />
      <View style={styles.flex}>
        <Text style={styles.campoLabel}>{label}</Text>
        <Text style={styles.campoValor}>{valor}</Text>
      </View>
      <Ionicons name="chevron-down" size={16} color={COLORS.muted} />
    </TouchableOpacity>
  );
}

function CampoInput({ label, valor, onChange }) {
  return (
    <View style={styles.campo}>
      <Ionicons name="business-outline" size={16} color={COLORS.gold} />
      <View style={styles.flex}>
        <Text style={styles.campoLabel}>{label}</Text>
        <TextInput
          style={styles.campoInput}
          value={valor}
          onChangeText={onChange}
          keyboardType="numbers-and-punctuation"
          placeholderTextColor={COLORS.muted}
        />
      </View>
    </View>
  );
}

function Opcao({ icon, iconTxt, titulo, descricao, valor, onChange, ultima }) {
  return (
    <View style={[styles.opcao, ultima && { borderBottomWidth: 0 }]}>
      <View style={styles.opcaoIcone}>
        {iconTxt ? (
          <Text style={styles.paypalTxt}>{iconTxt}</Text>
        ) : (
          <Ionicons name={icon} size={18} color={COLORS.gold} />
        )}
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

/* ---------- Tela ---------- */

export default function DadosRecebimento() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  // Dados bancários
  const [banco, setBanco] = useState('Banco do Brasil');
  const [agencia, setAgencia] = useState('1234');
  const [conta, setConta] = useState('56789-0');
  const [tipoConta, setTipoConta] = useState('Conta Corrente');
  const [seletor, setSeletor] = useState(null); // 'banco' | 'tipo' | null

  // Formas de recebimento
  const [pix, setPix] = useState(true);
  const [ted, setTed] = useState(true);
  const [paypal, setPaypal] = useState(false);
  const [cartao, setCartao] = useState(false);

  // Configurações
  const [notificacoes, setNotificacoes] = useState(true);
  const [comprovantes, setComprovantes] = useState(true);
  const [automatico, setAutomatico] = useState(false);
  const [minimo, setMinimo] = useState('100,00');
  const [editandoMinimo, setEditandoMinimo] = useState(false);

  const ir = (route) => {
    setMenuAberto(false);
    router.push(route);
  };

  const atualizarBanco = () => {
    Alert.alert('Dados atualizados', 'Seus dados bancários foram atualizados com sucesso.');
  };

  const opcoesSeletor = seletor === 'banco' ? BANCOS : TIPOS_CONTA;

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

        <TouchableOpacity onPress={() => ir('/perfilProfissional')} style={styles.topoBtn}>
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
        {/* Cabeçalho da página */}
        <View style={styles.cabecalho}>
          <View style={styles.iconeTitulo}>
            <Ionicons name="wallet-outline" size={22} color={COLORS.gold} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.h1}>Dados de Recebimento</Text>
            <Text style={styles.sub}>Gerencie seus dados bancários e formas de recebimento.</Text>
          </View>
        </View>
        <View style={styles.divisor} />

        {/* Dados Bancários */}
        <View style={styles.card}>
          <CardTitulo
            icon="business-outline"
            titulo="Dados Bancários"
            descricao="Informe seus dados bancários para receber seus pagamentos."
          />

          <CampoSelect label="Banco" valor={banco} onPress={() => setSeletor('banco')} />
          <CampoInput label="Agência" valor={agencia} onChange={setAgencia} />
          <CampoInput label="Conta Corrente" valor={conta} onChange={setConta} />
          <CampoSelect label="Tipo de Conta" valor={tipoConta} onPress={() => setSeletor('tipo')} />

          <TouchableOpacity style={styles.botaoOutline} onPress={atualizarBanco} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={16} color={COLORS.gold} />
            <Text style={styles.botaoOutlineTxt}>Atualizar dados bancários</Text>
          </TouchableOpacity>
        </View>

        {/* Formas de Recebimento */}
        <View style={styles.card}>
          <CardTitulo
            icon="wallet-outline"
            titulo="Formas de Recebimento"
            descricao="Escolha como deseja receber seus pagamentos."
          />

          <Opcao
            icon="diamond-outline"
            titulo="Transferência Bancária (PIX)"
            descricao="Receba via PIX de forma rápida e segura."
            valor={pix}
            onChange={setPix}
          />
          <Opcao
            icon="business-outline"
            titulo="TED / DOC"
            descricao="Receba via transferência bancária tradicional."
            valor={ted}
            onChange={setTed}
          />
          <Opcao
            iconTxt="P"
            titulo="PayPal"
            descricao="Receba através da sua conta PayPal."
            valor={paypal}
            onChange={setPaypal}
          />
          <Opcao
            icon="card-outline"
            titulo="Cartão de Crédito"
            descricao="Receba diretamente no seu cartão de crédito."
            valor={cartao}
            onChange={setCartao}
            ultima
          />
        </View>

        {/* Configurações de Recebimento */}
        <View style={styles.card}>
          <CardTitulo
            icon="settings-outline"
            titulo="Configurações de Recebimento"
            descricao="Configure suas preferências de recebimento e notificações."
          />

          <Opcao
            icon="notifications-outline"
            titulo="Notificações de pagamento"
            descricao="Receba e-mails e notificações sobre novos recebimentos."
            valor={notificacoes}
            onChange={setNotificacoes}
          />
          <Opcao
            icon="document-text-outline"
            titulo="Comprovantes automáticos"
            descricao="Receba comprovantes de pagamento por e-mail."
            valor={comprovantes}
            onChange={setComprovantes}
          />
          <Opcao
            icon="flash-outline"
            titulo="Recebimento automático"
            descricao="Libere o acesso ao valor assim que o pagamento for confirmado."
            valor={automatico}
            onChange={setAutomatico}
          />

          <View style={[styles.opcao, { borderBottomWidth: 0 }]}>
            <View style={styles.opcaoIcone}>
              <Ionicons name="cash-outline" size={18} color={COLORS.gold} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.opcaoTitulo}>Mínimo para transferência</Text>
              <Text style={styles.opcaoDesc}>Defina o valor mínimo para solicitar o saque.</Text>
            </View>

            <View style={styles.valorBox}>
              <Text style={styles.valorTxt}>R$ </Text>
              {editandoMinimo ? (
                <TextInput
                  style={styles.valorInput}
                  value={minimo}
                  onChangeText={setMinimo}
                  keyboardType="numeric"
                  autoFocus
                  onBlur={() => setEditandoMinimo(false)}
                />
              ) : (
                <Text style={styles.valorTxt}>{minimo}</Text>
              )}
              <TouchableOpacity onPress={() => setEditandoMinimo((v) => !v)} style={{ marginLeft: 6 }}>
                <Ionicons name="create-outline" size={14} color={COLORS.gold} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Histórico */}
        <View style={styles.card}>
          <CardTitulo
            icon="time-outline"
            titulo="Histórico de Recebimentos"
            descricao="Acompanhe seus pagamentos e transferências."
          />

          <View style={styles.tabelaHeader}>
            <Text style={[styles.th, { flex: 1.1 }]}>Data</Text>
            <Text style={[styles.th, { flex: 1.6 }]}>Descrição</Text>
            <Text style={[styles.th, { flex: 1.1 }]}>Valor</Text>
            <Text style={[styles.th, { width: 52, textAlign: 'right' }]}>Status</Text>
          </View>

          {HISTORICO.map((h) => (
            <View key={h.id} style={styles.tabelaLinha}>
              <Text style={[styles.td, { flex: 1.1 }]}>{h.data}</Text>
              <Text style={[styles.td, { flex: 1.6 }]}>{h.desc}</Text>
              <Text style={[styles.tdBold, { flex: 1.1 }]}>{h.valor}</Text>
              <View style={styles.pillBox}>
                <View style={styles.pill}>
                  <Text style={styles.pillTxt}>{h.status}</Text>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.botaoOutline}
            onPress={() => Alert.alert('Histórico', 'Abrir histórico completo.')}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={16} color={COLORS.gold} />
            <Text style={styles.botaoOutlineTxt}>Ver histórico completo</Text>
          </TouchableOpacity>
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

      {/* Seletor (Banco / Tipo de conta) */}
      <Modal visible={seletor !== null} transparent animationType="fade" onRequestClose={() => setSeletor(null)}>
        <Pressable style={styles.seletorOverlay} onPress={() => setSeletor(null)}>
          <View style={styles.seletorBox}>
            <Text style={styles.seletorTitulo}>
              {seletor === 'banco' ? 'Selecione o banco' : 'Selecione o tipo de conta'}
            </Text>
            {opcoesSeletor.map((op) => {
              const selecionado = seletor === 'banco' ? op === banco : op === tipoConta;
              return (
                <TouchableOpacity
                  key={op}
                  style={[styles.seletorItem, selecionado && styles.seletorItemAtivo]}
                  onPress={() => {
                    seletor === 'banco' ? setBanco(op) : setTipoConta(op);
                    setSeletor(null);
                  }}
                >
                  <Text style={[styles.seletorItemTxt, selecionado && { color: COLORS.gold }]}>{op}</Text>
                  {selecionado && <Ionicons name="checkmark" size={16} color={COLORS.gold} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
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
  h1: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  sub: { color: COLORS.mutedBlue, fontSize: 12, marginTop: 2 },
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
  cardTitulo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
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

  // Campos
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  campoLabel: { color: COLORS.muted, fontSize: 10 },
  campoValor: { color: COLORS.text, fontSize: 13, fontWeight: '700', marginTop: 2 },
  campoInput: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    padding: 0,
    marginTop: 2,
  },

  // Botão contorno
  botaoOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 11,
    marginTop: 6,
  },
  botaoOutlineTxt: { color: COLORS.gold, fontSize: 12, fontWeight: '600' },

  // Opções (switch)
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
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
  paypalTxt: { color: COLORS.gold, fontSize: 16, fontWeight: '800' },
  opcaoTitulo: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  opcaoDesc: { color: COLORS.mutedBlue, fontSize: 10, marginTop: 2, lineHeight: 14 },

  // Valor mínimo
  valorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardAlt,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  valorTxt: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  valorInput: { color: COLORS.text, fontSize: 12, fontWeight: '700', padding: 0, minWidth: 50 },

  // Tabela
  tabelaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  th: { color: COLORS.muted, fontSize: 10 },
  tabelaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  td: { color: COLORS.text, fontSize: 10, paddingRight: 4 },
  tdBold: { color: COLORS.text, fontSize: 10, fontWeight: '700', paddingRight: 4 },
  pillBox: { width: 52, alignItems: 'flex-end' },
  pill: { backgroundColor: COLORS.green, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  pillTxt: { color: COLORS.greenText, fontSize: 9, fontWeight: '600' },

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

  // Seletor
  seletorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  seletorBox: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    borderRadius: 10,
    padding: 14,
  },
  seletorTitulo: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 10 },
  seletorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  seletorItemAtivo: { backgroundColor: 'rgba(217,165,32,0.08)' },
  seletorItemTxt: { color: COLORS.text, fontSize: 13 },

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