import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export default function App() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("imagem")
  const [arquivo, setArquivo] = useState(null)
  const [listaArquivos, setListaArquivos] = useState([])

  async function carregarArquivos() {
    const { data, error } = await supabase
      .from("arquivos")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setListaArquivos(data || [])
  }

  useEffect(() => {
    carregarArquivos()
  }, [])

  async function salvarArquivo(e) {
    e.preventDefault()

    if (!arquivo) {
      alert("Selecione um arquivo")
      return
    }

    const nomeArquivo =
      `${Date.now()}-${arquivo.name.replace(/\s/g, "_")}`

    const { error: erroUpload } = await supabase.storage
      .from("arquivoslista")
      .upload(nomeArquivo, arquivo)

    if (erroUpload) {
      alert("Erro ao enviar arquivo: " + erroUpload.message)
      return
    }

    const { data: urlData } = supabase.storage
      .from("arquivoslista")
      .getPublicUrl(nomeArquivo)

    console.log("URL:", urlData.publicUrl)

    const { error: erroBanco } = await supabase
      .from("arquivos")
      .insert([
        {
          titulo,
          descricao,
          tipo,
          urlpublica: urlData.publicUrl
        }
      ])

    if (erroBanco) {
      alert("Erro ao salvar no banco: " + erroBanco.message)
      return
    }

    setTitulo("")
    setDescricao("")
    setTipo("imagem")
    setArquivo(null)

    carregarArquivos()

    alert("Arquivo salvo com sucesso")
  }

  function renderizarArquivo(item) {
    if (item.tipo === "imagem") {
      return (
        <img
          src={item.urlpublica}
          alt={item.titulo}
          width="300"
          onError={() =>
            console.log("Erro ao carregar:", item.urlpublica)
          }
        />
      )
    }

    if (item.tipo === "musica") {
      return (
        <audio controls>
          <source src={item.urlpublica} />
        </audio>
      )
    }

    if (item.tipo === "video") {
      return (
        <video width="400" controls>
          <source src={item.urlpublica} />
        </video>
      )
    }

    return null
  }

  return (
    <div>
      <h1>RG's Moments</h1>

      <form onSubmit={salvarArquivo}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="imagem">Imagem</option>
          <option value="musica">Áudio</option>
          <option value="video">Vídeo</option>
        </select>

        <input
          type="file"
          onChange={(e) => setArquivo(e.target.files[0])}
          required
        />

        <button type="submit">
          Enviar
        </button>
      </form>

      <hr />

      <h2>Arquivos Salvos</h2>

      {listaArquivos.map((item) => (
        <div key={item.id}>
          <h3>{item.titulo}</h3>
          <p>{item.descricao}</p>

          {renderizarArquivo(item)}

          <hr />
        </div>
      ))}
    </div>
  )
}