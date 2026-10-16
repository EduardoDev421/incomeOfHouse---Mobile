import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  green: '#0e5a3a',
  greenText: '#e8fff3',
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
  ['Sobre', '/sobre'],
];

const TIPOS_EMPRESA = ['Construtora', 'Imobiliária', 'Arquitetura', 'Engenharia'];
const CIDADES = ['São Paulo', 'Brasília', 'Rio de Janeiro'];
const ESTADOS = ['SP', 'DF', 'RJ'];

const DOCUMENTOS = [
  { id: '1', nome: 'Contrato Social', data: 'Enviado em 15/04/2025' },
  { id: '2', nome: 'Comprovante de Endereço', data: 'Enviado em 10/04/2025' },
  { id: '3', nome: 'Certidão Negativa de Débitos', data: 'Enviado em 08/04/2025' },
];

const DADOS_INICIAIS = {
  nome: 'Income Of Houses',
  cnpj: '12.345.678/0001-90',
  tipo: 'Construtora',
  telefone: '(11) 98765-4321',
  email: 'contato@incomeofhouses.com',
  cep: '01310-100',
  logradouro: 'Av. Paulista',
  numero: '1000',
  complemento: 'Conjunto 501',
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  estado: 'SP',
  sobre:
    'Somos uma plataforma que conecta pessoas e profissionais da área de arquitetura e construção, facilitando a realização de projetos únicos e personalizados.',
  site: 'www.incomeofhouses.com',
  redes: ['@incomeofhouses'],
};

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

function Label({ children, obrigatorio }) {
  return (
    <Text style={styles.label}>
      {children}
      {obrigatorio ? <Text style={styles.asterisco}> *</Text> : null}
    </Text>
  );
}

function CampoTexto({ label, obrigatorio, icon, value, onChangeText, keyboardType, autoCapitalize = 'none' }) {
  return (
    <View style={styles.campo}>
      <Label obrigatorio={obrigatorio}>{label}</Label>
      <View style={styles.inputBox}>
        {icon ? <Ionicons name={icon} size={16} color={COLORS.gold} /> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={COLORS.muted}
        />
      </View>
    </View>
  );
}

function CampoSelect({ label, obrigatorio, value, onPress }) {
  return (
    <View style={styles.campo}>
      <Label obrigatorio={obrigatorio}>{label}</Label>
      <TouchableOpacity style={styles.inputBox} onPress={onPress} activeOpacity={0.8}>
        <Text style={[styles.input, styles.selectTxt]}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.muted} />
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Tela ---------- */

export default function DadosEmpresa() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [form, setForm] = useState(DADOS_INICIAIS);
  const [seletor, setSeletor] = useState(null); // { campo, titulo, opcoes }

  const ir = (route) => {
    setMenuAberto(false);
    router.push(route);
  };

  const set = (campo) => (valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const abrirSeletor = (campo, titulo, opcoes) => setSeletor({ campo, titulo, opcoes });

  const alterarRede = (indice, valor) =>
    setForm((prev) => ({ ...prev, redes: prev.redes.map((r, i) => (i === indice ? valor : r)) }));

  const adicionarRede = () => setForm((prev) => ({ ...prev, redes: [...prev.redes, ''] }));

  const removerRede = (indice) =>
    setForm((prev) => ({ ...prev, redes: prev.redes.filter((_, i) => i !== indice) }));

  const cancelar = () => {
    Alert.alert('Cancelar alterações', 'Deseja descartar as alterações feitas?', [
      { text: 'Continuar editando', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: () => setForm(DADOS_INICIAIS) },
    ]);
  };

  const salvar = () => {
    const obrigatorios = ['nome', 'cnpj', 'telefone', 'email', 'cep', 'logradouro', 'numero', 'bairro'];
    if (obrigatorios.some((c) => !form[c].trim())) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *.');
      return;
    }
    Alert.alert('Dados salvos', 'As informações da empresa foram atualizadas com sucesso.');
  };

  const alterarLogo = () => {
    // Para escolher imagem da galeria, instale: npx expo install expo-image-picker
    Alert.alert('Alterar logo', 'Aqui você pode abrir a galeria com o expo-image-picker.');
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

        <View style={styles.topoBtn} />
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
          <Text style={styles.h1}>Dados da Empresa</Text>
          <Text style={styles.sub}>Gerencie as informações da sua empresa.</Text>
          <View style={styles.divisor} />

          {/* Informações Básicas */}
          <View style={styles.card}>
            <CardTitulo icon="business-outline" titulo="Informações Básicas" descricao="Dados principais da sua empresa." />

            <CampoTexto
              label="Nome da empresa"
              obrigatorio
              icon="business-outline"
              value={form.nome}
              onChangeText={set('nome')}
              autoCapitalize="words"
            />
            <CampoTexto
              label="CNPJ"
              obrigatorio
              icon="document-text-outline"
              value={form.cnpj}
              onChangeText={set('cnpj')}
              keyboardType="numbers-and-punctuation"
            />
            <CampoSelect
              label="Tipo de empresa"
              obrigatorio
              value={form.tipo}
              onPress={() => abrirSeletor('tipo', 'Tipo de empresa', TIPOS_EMPRESA)}
            />
            <CampoTexto
              label="Telefone"
              obrigatorio
              icon="call-outline"
              value={form.telefone}
              onChangeText={set('telefone')}
              keyboardType="phone-pad"
            />
            <CampoTexto
              label="E-mail corporativo"
              obrigatorio
              icon="mail-outline"
              value={form.email}
              onChangeText={set('email')}
              keyboardType="email-address"
            />
          </View>

          {/* Endereço Comercial */}
          <View style={styles.card}>
            <CardTitulo icon="location-outline" titulo="Endereço Comercial" descricao="Informe o endereço da sua empresa." />

            <CampoTexto label="CEP" obrigatorio value={form.cep} onChangeText={set('cep')} keyboardType="numbers-and-punctuation" />
            <CampoTexto
              label="Logradouro"
              obrigatorio
              value={form.logradouro}
              onChangeText={set('logradouro')}
              autoCapitalize="words"
            />

            <View style={styles.duasColunas}>
              <View style={styles.flex}>
                <CampoTexto label="Número" obrigatorio value={form.numero} onChangeText={set('numero')} keyboardType="numeric" />
              </View>
              <View style={styles.flex}>
                <CampoTexto
                  label="Complemento"
                  value={form.complemento}
                  onChangeText={set('complemento')}
                  autoCapitalize="sentences"
                />
              </View>
            </View>

            <CampoTexto label="Bairro" obrigatorio value={form.bairro} onChangeText={set('bairro')} autoCapitalize="words" />

            <View style={styles.duasColunas}>
              <View style={{ flex: 2 }}>
                <CampoSelect
                  label="Cidade"
                  obrigatorio
                  value={form.cidade}
                  onPress={() => abrirSeletor('cidade', 'Cidade', CIDADES)}
                />
              </View>
              <View style={styles.flex}>
                <CampoSelect
                  label="Estado"
                  obrigatorio
                  value={form.estado}
                  onPress={() => abrirSeletor('estado', 'Estado', ESTADOS)}
                />
              </View>
            </View>
          </View>

          {/* Sobre a Empresa */}
          <View style={styles.card}>
            <CardTitulo icon="create-outline" titulo="Sobre a Empresa" descricao="Conte um pouco sobre a sua empresa." />

            <View style={styles.textareaBox}>
              <TextInput
                style={styles.textarea}
                value={form.sobre}
                onChangeText={set('sobre')}
                multiline
                maxLength={500}
                textAlignVertical="top"
                placeholderTextColor={COLORS.muted}
              />
            </View>
            <Text style={styles.contador}>{form.sobre.length}/500</Text>
          </View>

          {/* Identidade Visual */}
          <View style={styles.card}>
            <CardTitulo icon="color-palette-outline" titulo="Identidade Visual" descricao="Logo e informações de contato." />

            <View style={styles.logoArea}>
              <View style={styles.logoBox}>
                <Image source={LOGO} style={styles.logoGrande} resizeMode="contain" />
              </View>
              <TouchableOpacity style={styles.botaoOutline} onPress={alterarLogo} activeOpacity={0.8}>
                <Ionicons name="image-outline" size={16} color={COLORS.gold} />
                <Text style={styles.botaoOutlineTxt}>Alterar logo</Text>
              </TouchableOpacity>
            </View>

            <CampoTexto label="Site (opcional)" value={form.site} onChangeText={set('site')} keyboardType="url" />

            <View style={styles.campo}>
              <Label>Redes sociais (opcional)</Label>
              {form.redes.map((rede, i) => (
                <View key={i} style={styles.redeRow}>
                  <View style={[styles.inputBox, styles.flex]}>
                    <TextInput
                      style={styles.input}
                      value={rede}
                      onChangeText={(v) => alterarRede(i, v)}
                      autoCapitalize="none"
                      placeholder="@suaempresa"
                      placeholderTextColor={COLORS.muted}
                    />
                  </View>
                  {i === form.redes.length - 1 ? (
                    <TouchableOpacity style={styles.redeBtn} onPress={adicionarRede}>
                      <Ionicons name="add" size={20} color={COLORS.gold} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.redeBtn} onPress={() => removerRede(i)}>
                      <Ionicons name="close" size={18} color={COLORS.muted} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Documentos */}
          <View style={styles.card}>
            <CardTitulo icon="folder-open-outline" titulo="Documentos" descricao="Mantenha seus documentos atualizados." />

            {DOCUMENTOS.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={styles.documento}
                activeOpacity={0.8}
                onPress={() => Alert.alert(d.nome, d.data)}
              >
                <View style={styles.docIcone}>
                  <Ionicons name="document-text-outline" size={18} color={COLORS.gold} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.docNome}>{d.nome}</Text>
                  <Text style={styles.docData}>{d.data}</Text>
                </View>
                <View style={styles.pill}>
                  <Text style={styles.pillTxt}>Ativo</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.botaoOutline, { marginTop: 6 }]}
              onPress={() => Alert.alert('Documentos', 'Abrir gerenciamento de documentos.')}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoOutlineTxt}>Gerenciar documentos</Text>
            </TouchableOpacity>
          </View>

          {/* Ações */}
          <View style={styles.acoes}>
            <TouchableOpacity style={[styles.botaoOutline, styles.flex]} onPress={cancelar} activeOpacity={0.8}>
              <Text style={styles.botaoOutlineTxt}>Cancelar alterações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botaoSalvar, styles.flex]} onPress={salvar} activeOpacity={0.8}>
              <Text style={styles.botaoSalvarTxt}>Salvar alterações</Text>
            </TouchableOpacity>
          </View>

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

      {/* Seletor (Tipo / Cidade / Estado) */}
      <Modal visible={seletor !== null} transparent animationType="fade" onRequestClose={() => setSeletor(null)}>
        <Pressable style={styles.seletorOverlay} onPress={() => setSeletor(null)}>
          <View style={styles.seletorBox}>
            <Text style={styles.seletorTitulo}>{seletor?.titulo}</Text>
            {seletor?.opcoes.map((op) => {
              const selecionado = form[seletor.campo] === op;
              return (
                <TouchableOpacity
                  key={op}
                  style={[styles.seletorItem, selecionado && styles.seletorItemAtivo]}
                  onPress={() => {
                    set(seletor.campo)(op);
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
  h1: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
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
  campo: { marginBottom: 12 },
  label: { color: COLORS.text, fontSize: 11, marginBottom: 6 },
  asterisco: { color: COLORS.gold, fontWeight: '700' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 13, padding: 0 },
  selectTxt: { lineHeight: 18 },
  duasColunas: { flexDirection: 'row', gap: 10 },

  // Textarea
  textareaBox: {
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
  },
  textarea: { color: COLORS.text, fontSize: 13, minHeight: 110, padding: 0, lineHeight: 19 },
  contador: { color: COLORS.muted, fontSize: 10, textAlign: 'right', marginTop: 6 },

  // Identidade
  logoArea: { alignItems: 'center', gap: 12, marginBottom: 14 },
  logoBox: {
    width: 120,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGrande: { width: 90, height: 60 },
  redeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  redeBtn: {
    width: 44,
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Documentos
  documento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  docIcone: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docNome: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  docData: { color: COLORS.muted, fontSize: 10, marginTop: 2 },
  pill: { backgroundColor: COLORS.green, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  pillTxt: { color: COLORS.greenText, fontSize: 10, fontWeight: '600' },

  // Botões
  botaoOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 12,
  },
  botaoOutlineTxt: { color: COLORS.gold, fontSize: 12, fontWeight: '600' },
  botaoSalvar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 12,
  },
  botaoSalvarTxt: { color: '#0a0a0a', fontSize: 12, fontWeight: '700' },
  acoes: { flexDirection: 'row', gap: 10, marginBottom: 20 },

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