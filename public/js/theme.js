// Lista de palavras e pistas sobre anatomia
const theme = document.querySelector('#theme').textContent

const itensMatrix = {
  biologia: [
    { word: 'coração', clue: 'Órgão responsável por bombear sangue pelo corpo' },
    { word: 'fêmur', clue: 'Osso da coxa' },
    { word: 'cérebro', clue: 'Órgão responsável pelas funções mentais' },
    { word: 'artéria', clue: 'Vaso sanguíneo que leva o sangue do coração' },
    { word: 'veia', clue: 'Vaso sanguíneo que leva o sangue de volta ao coração' },
    { word: 'pulmão', clue: 'Órgão responsável pela troca gasosa no corpo' },
    { word: 'rins', clue: 'Órgãos responsáveis pela filtragem do sangue' },
    { word: 'ossos', clue: 'Estruturas que formam o esqueleto' },
    { word: 'músculos', clue: 'Tecidos que permitem o movimento do corpo' },
    { word: 'nervos', clue: 'Estruturas que transmitem sinais do cérebro para o corpo' },
  ],
  quimica: [
    { word: 'hidrogênio', clue: 'Elemento químico mais abundante no universo, com símbolo H' },
    { word: 'oxigênio', clue: 'Elemento essencial para a respiração dos seres vivos, com símbolo O' },
    { word: 'carbono', clue: 'Elemento central na química orgânica, com símbolo C' },
    { word: 'sódio', clue: 'Elemento altamente reativo, encontrado em sal, com símbolo Na' },
    { word: 'cloro', clue: 'Elemento químico utilizado em desinfetantes e com símbolo Cl' },
    { word: 'potássio', clue: 'Elemento químico que atua no equilíbrio dos fluidos corporais, com símbolo K' },
    { word: 'ferro', clue: 'Metal usado na fabricação de aço, com símbolo Fe' },
    { word: 'ouro', clue: 'Metal precioso de cor amarela, com símbolo Au' },
    { word: 'álcool', clue: 'Composto orgânico que contém um grupo hidroxila (-OH)' },
    { word: 'nitrogênio', clue: 'Elemento que compõe 78% da atmosfera terrestre, com símbolo N' },
    { word: 'cálcio', clue: 'Elemento importante para a formação dos ossos, com símbolo Ca' },
    { word: 'fósforo', clue: 'Elemento essencial para a vida, presente no DNA, com símbolo P' },
    { word: 'enxofre', clue: 'Elemento químico com símbolo S, utilizado na fabricação de ácido sulfúrico' },
    { word: 'magnésio', clue: 'Elemento encontrado em clorofila, essencial para plantas, com símbolo Mg' },
    { word: 'prata', clue: 'Metal precioso usado em joias, com símbolo Ag' },
    { word: 'zinco', clue: 'Metal usado na galvanização, com símbolo Zn' },
    { word: 'mercúrio', clue: 'Metal líquido à temperatura ambiente, com símbolo Hg' },
    { word: 'urânio', clue: 'Elemento radioativo utilizado em energia nuclear, com símbolo U' },
    { word: 'silício', clue: 'Elemento fundamental na fabricação de chips eletrônicos, com símbolo Si' },
    { word: 'bromo', clue: 'Elemento químico líquido à temperatura ambiente, com símbolo Br' },
    { word: 'cobre', clue: 'Metal utilizado em fiação elétrica, com símbolo Cu' },
    { word: 'alumínio', clue: 'Metal leve, utilizado em utensílios domésticos, com símbolo Al' },
    { word: 'lítio', clue: 'Elemento utilizado em baterias recarregáveis, com símbolo Li' },
    { word: 'iodo', clue: 'Elemento utilizado em soluções antissépticas, com símbolo I' },
    { word: 'flúor', clue: 'Elemento utilizado em pasta de dente e com símbolo F' },
    { word: 'tálio', clue: 'Elemento tóxico utilizado em circuitos eletrônicos, com símbolo Tl' },
    { word: 'radônio', clue: 'Elemento radioativo, com símbolo Rn, encontrado em rochas' },
    { word: 'platina', clue: 'Metal precioso, com símbolo Pt, usado em joias e catalisadores' },
    { word: 'cromo', clue: 'Metal utilizado em ligas e como revestimento, com símbolo Cr' },
    { word: 'nióbio', clue: 'Elemento metálico utilizado em supercondutores, com símbolo Nb' },
    { word: 'tungstênio', clue: 'Elemento com ponto de fusão muito alto, utilizado em lâmpadas, com símbolo W' }
]


};

let themeArray = itensMatrix['quimica']
if (Object.keys(itensMatrix).includes(theme)) {
    themeArray = itensMatrix[theme]
}
// console.log(itens + ' = ' + Object.keys(itensMatrix).includes(theme) + ' ? ' + itensMatrix[theme] + ' : ' + itensMatrix[0])