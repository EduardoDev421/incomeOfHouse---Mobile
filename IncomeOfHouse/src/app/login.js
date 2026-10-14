import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const entrar = () => {
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setErro('');
    // TODO: autenticar no seu backend aqui
    router.push('/');
  };

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.caixa}>
        <Text style={styles.titulo}>Entrar</Text>
        <Text style={styles.subtitulo}>Acesse sua conta IncomeOfHouses</Text>

        <Text style={styles.rotulo}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seuemail@exemplo.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.rotulo}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Sua senha"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <Pressable style={styles.botao} onPress={entrar}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/cadastro')}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.voltar}>← Voltar ao início</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f5f7f4' },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  caixa: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#254b35' },
  subtitulo: { fontSize: 14, color: '#555', marginTop: 4, marginBottom: 20 },
  rotulo: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccd5cd',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 14,
    color: '#222',
  },
  erro: { color: '#c0392b', fontSize: 13, marginBottom: 10 },
  botao: {
    backgroundColor: '#397653',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  link: { color: '#397653', textAlign: 'center', marginTop: 18, fontSize: 14 },
  voltar: { color: '#555', textAlign: 'center', marginTop: 14, fontSize: 13 },
});