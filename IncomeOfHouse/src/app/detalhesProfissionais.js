import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DOURADO = '#c9a45c';

const FUNDO = require('../../assets/images/detalhes-profissional.png');

/* ------------------------------------------------------------------ */
/* DADOS DE EXEMPLO (nomes fictícios)                                  */

const DESCRICAO_PADRAO =
  'Profissional especializado em projetos arquitetônicos modernos e residenciais. Trabalha com soluções personalizadas, buscando unir sofisticação, funcionalidade e qualidade em cada projeto.';

const PROFISSIONAIS = {
  1: { nome: 'Carlos Mendes', profissao: 'Engenheiro(a) Civil', cidade: 'Manaus - AM', anos: 15, nota: 5.0, avaliacoes: 128 },
  2: { nome: 'Ana Beatriz Souza', profissao: 'Arquiteto(a)', cidade: 'São Paulo - SP', anos: 12, nota: 4.9, avaliacoes: 96 },
  3: { nome: 'Rafael Lima', profissao: 'Designer de Interiores', cidade: 'Rio de Janeiro - RJ', anos: 10, nota: 4.8, avaliacoes: 74 },
  4: { nome: 'Juliana Castro', profissao: 'Paisagista', cidade: 'Belo Horizonte - MG', anos: 9, nota: 4.9, avaliacoes: 61 },
  5: { nome: 'Marcos Oliveira', profissao: 'Topógrafo(a)', cidade: 'Goiânia - GO', anos: 18, nota: 4.7, avaliacoes: 143 },
  6: { nome: 'Fernanda Alves', profissao: 'Especialista BIM', cidade: 'Brasília - DF', anos: 8, nota: 5.0, avaliacoes: 52 },
  7: { nome: 'Paulo Henrique Dias', profissao: 'Projetista Estrutural', cidade: 'Curitiba - PR', anos: 15, nota: 4.8, avaliacoes: 89 },
  8: { nome: 'Camila Rocha', profissao: 'Arquiteto(a) e Urbanista', cidade: 'Salvador - BA', anos: 12, nota: 4.7, avaliacoes: 67 },
};

// Usado se o id não for encontrado (igual ao modelo do site)
const PROFISSIONAL_PADRAO = {
  nome: 'Nome do Profissional',
  profissao: 'Arquiteto',
  cidade: 'Brasília - DF',
  anos: 8,
  nota: 0,
  avaliacoes: 0,
};

const COMENTARIO = {
  cliente: 'Nome do Cliente',
  quando: 'Há 1 ano',
  nota: 5,
  texto:
    'Excelente profissional! Muito atencioso, responsável e comprometido com o projeto. Fiquei muito satisfeito com o resultado.',
};

const ITENS_ORCAMENTO = [
  { icone: 'cash-outline', titulo: 'Investimento inicial', texto: 'A partir de ', destaque: 'R$ 2.500' },
  { icone: 'time-outline', titulo: 'Prazo estimado', texto: '5 a 10 dias úteis' },
  { icone: 'location-outline', titulo: 'Atendimento', texto: 'Presencial e online' },
];

const formatarNota = (n) => n.toFixed(1).replace('.', ',');

function Estrelas({ nota, tamanho = 18 }) {
  return (
    <View style={styles.estrelas}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ionicons
          key={i}
          name="star"
          size={tamanho}
          color={i < Math.round(nota) ? DOURADO : '#3a3a3a'}
        />
      ))}
    </View>
  );
}

export default function DetalhesProfissionais() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const largo = width >= 900;

  const navegar = (rota) => router.push(rota);

  const p = PROFISSIONAIS[Number(id)] || PROFISSIONAL_PADRAO;
  const descricao = p.descricao || DESCRICAO_PADRAO;

  // Nome: última palavra em dourado, como no site ("Nome do" + "Profissional")
  const palavras = p.nome.split(' ');
  const ultima = palavras.pop();
  const inicio = palavras.join(' ');

  return (
    <View style={styles.raiz}>
      <StatusBar barStyle="light-content" />

      {/* Fundo da página inteira */}
      <Image source={FUNDO} style={styles.fundoImagem} resizeMode="cover" />
      <View style={styles.fundoOverlay} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo}>
        {/* Cabeçalho */}
        <View style={[styles.topo, largo ? styles.topoLargo : styles.topoEstreito]}>
          <Pressable onPress={() => navegar('/')}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>

          <View style={[styles.menu, !largo && styles.menuEstreito]}>
            <Pressable style={styles.item} onPress={() => navegar('/')}>
              <Text style={styles.textoItem}>Início</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navegar('/planta')}>
              <Text style={styles.textoItem}>Plantas</Text>
            </Pressable>
            <Pressable style={styles.itemAtivo} onPress={() => navegar('/profissionais')}>
              <Text style={styles.textoAtivo}>Profissionais</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navegar('/sobre')}>
              <Text style={styles.textoItem}>Sobre Nós</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.perfil, !largo && styles.perfilEstreito]}
            onPress={() => navegar('/login')}
          >
            <Ionicons name="person-circle-outline" size={42} color={DOURADO} />
          </Pressable>
        </View>

        <View style={styles.pagina}>
          <Pressable style={styles.voltar} onPress={() => navegar('/profissionais')}>
            <Ionicons name="arrow-back" size={16} color={DOURADO} />
            <Text style={styles.voltarTexto}>Voltar para profissionais</Text>
          </Pressable>

          {/* Perfil */}
          <View style={[styles.perfilCard, largo && styles.perfilCardLargo]}>
            <View style={[styles.fotoArea, largo && styles.fotoAreaLarga]}>
              {p.foto ? (
                <Image source={p.foto} style={styles.foto} resizeMode="cover" />
              ) : (
                <Ionicons name="person" size={110} color="#333" />
              )}
            </View>

            <View style={styles.info}>
              <Text style={[styles.nome, largo && styles.nomeLargo]}>
                {inicio ? `${inicio} ` : ''}
                <Text style={styles.nomeDestaque}>{ultima}</Text>
              </Text>

              <Text style={styles.profissao}>{p.profissao}</Text>

              <View style={styles.avaliacaoLinha}>
                <Ionicons name="star" size={20} color={DOURADO} />
                <Text style={styles.avaliacaoNota}>{formatarNota(p.nota)}</Text>
                <Text style={styles.avaliacaoQtd}>({p.avaliacoes} avaliações)</Text>
              </View>

              <View style={styles.dados}>
                <View style={styles.dado}>
                  <Text style={styles.dadoTitulo}>Cidade</Text>
                  <Text style={styles.dadoTexto}>{p.cidade}</Text>
                </View>
                <View style={styles.dado}>
                  <Text style={styles.dadoTitulo}>Tempo de Experiência</Text>
                  <Text style={styles.dadoTexto}>{p.anos} anos</Text>
                </View>
              </View>

              <Text style={styles.descricao}>{descricao}</Text>
            </View>
          </View>

          {/* Cards inferiores */}
          <View style={[styles.inferiores, largo && styles.inferioresLargo]}>
            {/* Avaliações */}
            <View style={[styles.card, largo && styles.cardAvaliacoes]}>
              <View style={styles.cardTituloLinha}>
                <Ionicons name="star" size={20} color={DOURADO} />
                <Text style={styles.cardTitulo}>Avaliações do Cliente</Text>
              </View>

              <View style={styles.notaGeral}>
                <Text style={styles.notaGeralNumero}>{formatarNota(p.nota)}</Text>
                <Estrelas nota={p.nota} tamanho={20} />
                <Text style={styles.notaGeralQtd}>{p.avaliacoes} avaliações</Text>
              </View>

              <View style={styles.comentario}>
                <View style={styles.cliente}>
                  <View style={styles.clienteFoto}>
                    <Ionicons name="person" size={22} color="#555" />
                  </View>
                  <View>
                    <Text style={styles.clienteNome}>{COMENTARIO.cliente}</Text>
                    <Text style={styles.clienteQuando}>{COMENTARIO.quando}</Text>
                  </View>
                </View>

                <View style={styles.comentarioEstrelas}>
                  <Estrelas nota={COMENTARIO.nota} tamanho={15} />
                </View>

                <Text style={styles.comentarioTexto}>{COMENTARIO.texto}</Text>
              </View>

              <Pressable
                style={styles.verMais}
                onPress={() => {
                  // TODO: abrir a tela de comentários quando ela existir
                }}
              >
                <Text style={styles.verMaisTexto}>Ver mais avaliações</Text>
                <Ionicons name="arrow-forward" size={16} color={DOURADO} />
              </Pressable>
            </View>

            {/* Orçamento */}
            <View style={[styles.card, largo && styles.cardOrcamento]}>
              <Text style={styles.orcamentoTitulo}>Solicitar Orçamento</Text>
              <Text style={styles.orcamentoTexto}>
                Descreva seu projeto e receba um orçamento personalizado.
              </Text>

              <View style={styles.orcamentoItens}>
                {ITENS_ORCAMENTO.map((o) => (
                  <View key={o.titulo} style={styles.orcamentoItem}>
                    <View style={styles.orcamentoIcone}>
                      <Ionicons name={o.icone} size={18} color={DOURADO} />
                    </View>
                    <View style={styles.orcamentoItemTextos}>
                      <Text style={styles.orcamentoItemTitulo}>{o.titulo}</Text>
                      <Text style={styles.orcamentoItemTexto}>
                        {o.texto}
                        {o.destaque && <Text style={styles.orcamentoDestaque}>{o.destaque}</Text>}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.pagamento}>
                <Text style={styles.pagamentoTitulo}>Formas de Pagamento</Text>
                <Text style={styles.pagamentoTexto}>PIX, Boleto e Cartão de Crédito</Text>
              </View>

              <Pressable
                style={styles.btnOrcamento}
                onPress={() => {
                  // TODO: enviar a solicitação de orçamento para o seu backend
                }}
              >
                <Text style={styles.btnOrcamentoTexto}>Solicitar Orçamento</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <View style={[styles.rodape, largo && styles.rodapeLargo]}>
          <Text style={styles.textoRodape}>
            ©IncomeOfHouses. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#0a0a0a' },

  fundoImagem: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fundoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.55)' },

  scroll: { flex: 1, backgroundColor: 'transparent' },
  conteudo: { flexGrow: 1 },

  // Cabeçalho
  topo: {
    backgroundColor: 'rgba(10, 10, 10, 0.55)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 24,
  },
  topoLargo: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 140,
  },
  topoEstreito: { alignItems: 'center', paddingTop: 40, paddingBottom: 16 },
  logo: { width: 110, height: 60 },
  menu: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuEstreito: { flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemAtivo: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6b5a36',
    backgroundColor: 'rgba(28, 26, 20, 0.9)',
  },
  textoItem: { color: '#ffffff', fontSize: 14 },
  textoAtivo: { color: DOURADO, fontSize: 14 },
  perfil: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  perfilEstreito: { position: 'absolute', right: 20, top: 40 },

  // Conteúdo
  pagina: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 60,
    gap: 24,
  },
  voltar: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  voltarTexto: { color: DOURADO, fontSize: 14 },

  // Perfil
  perfilCard: {
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 24,
    gap: 28,
  },
  perfilCardLargo: { flexDirection: 'row', padding: 32, gap: 40 },
  fotoArea: {
    width: '100%',
    height: 300,
    borderRadius: 14,
    backgroundColor: '#1d1d1d',
    borderWidth: 1,
    borderColor: '#2c2c2c',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fotoAreaLarga: { width: 320, height: 380 },
  foto: { width: '100%', height: '100%' },
  info: { flex: 1, justifyContent: 'center' },
  nome: { color: '#ffffff', fontSize: 30, fontWeight: '900', lineHeight: 38 },
  nomeLargo: { fontSize: 40, lineHeight: 48 },
  nomeDestaque: { color: DOURADO },
  profissao: { color: DOURADO, fontSize: 18, fontWeight: '600', marginTop: 8 },

  avaliacaoLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  avaliacaoNota: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  avaliacaoQtd: { color: '#a8a8a8', fontSize: 13 },

  dados: { flexDirection: 'row', flexWrap: 'wrap', gap: 40, marginTop: 24 },
  dado: {},
  dadoTitulo: { color: '#8a8a8a', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  dadoTexto: { color: '#ffffff', fontSize: 16, marginTop: 4 },

  descricao: { color: '#d0d0d0', fontSize: 14, lineHeight: 24, marginTop: 24, maxWidth: 620 },

  // Cards inferiores
  inferiores: { gap: 24 },
  inferioresLargo: { flexDirection: 'row', alignItems: 'flex-start' },
  card: {
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 26,
  },
  cardAvaliacoes: { flex: 1.6 },
  cardOrcamento: { flex: 1 },

  // Avaliações
  cardTituloLinha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitulo: { color: '#ffffff', fontSize: 19, fontWeight: 'bold' },
  notaGeral: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginTop: 22 },
  notaGeralNumero: { color: '#ffffff', fontSize: 40, fontWeight: '900' },
  notaGeralQtd: { color: '#a8a8a8', fontSize: 13 },
  estrelas: { flexDirection: 'row', gap: 3 },

  comentario: {
    marginTop: 24,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 20,
  },
  cliente: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clienteFoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clienteNome: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  clienteQuando: { color: '#8a8a8a', fontSize: 12, marginTop: 2 },
  comentarioEstrelas: { marginTop: 14 },
  comentarioTexto: { color: '#d0d0d0', fontSize: 14, lineHeight: 23, marginTop: 12 },

  verMais: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 22,
  },
  verMaisTexto: { color: DOURADO, fontSize: 14, fontWeight: 'bold' },

  // Orçamento
  orcamentoTitulo: { color: '#ffffff', fontSize: 21, fontWeight: 'bold' },
  orcamentoTexto: { color: '#b5b5b5', fontSize: 14, lineHeight: 22, marginTop: 8 },
  orcamentoItens: { gap: 18, marginTop: 24 },
  orcamentoItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  orcamentoIcone: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2a2418',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orcamentoItemTextos: { flex: 1 },
  orcamentoItemTitulo: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  orcamentoItemTexto: { color: '#b5b5b5', fontSize: 13, marginTop: 2 },
  orcamentoDestaque: { color: DOURADO, fontWeight: 'bold' },

  pagamento: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  pagamentoTitulo: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  pagamentoTexto: { color: '#b5b5b5', fontSize: 13, marginTop: 6 },

  btnOrcamento: {
    marginTop: 24,
    backgroundColor: DOURADO,
    borderRadius: 8,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOrcamentoTexto: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 14 },

  // Rodapé
  rodape: {
    backgroundColor: 'rgba(10, 10, 10, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 164, 92, 0.5)',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  rodapeLargo: { paddingHorizontal: 115 },
  textoRodape: { color: '#9a9a9a', fontSize: 12 },
});