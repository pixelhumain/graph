var data = [];

data[0] = {
      nodes: [
        { "@id":"http://fluidlog.com/node/0",
          "@type": "av:without",
          index:0,
          label: "",
          hypertext: "",
          x:300,
          y:200,
          },
      ],
      edges: []
}

data[1] = {
      nodes: [
              {index:0, label: "A", "@type":"av:project", x:100, y:100, "@id":"http://fluidlog.com/node/0" },
              {index:1, label: "B", "@type":"av:idea", x:200, y:200, "@id":"http://fluidlog.com/node/1" },
              {index:2, label: "C", "@type":"av:project", x:300, y:300, "@id":"http://fluidlog.com/node/2" },
      ],
      edges: [
              { source: 0, target: 1 },
      ]
}

data[2] = {
      nodes: [
              {index:0, label: "A petit texte", "@type":"av:project", x:100, y:100, "@id":"http://fluidlog.com/node/0" },
              {index:1, label: "B texte sur deux longues lignes", type:"av:idea", x:200, y:200, "@id":"http://fluidlog.com/node/1" },
              {index:2, label: "C", "@type":"av:project", x:400, y:200, "@id":"http://fluidlog.com/node/2" },
              {index:3, label: "D", "@type":"av:idea", x:400, y:400, "@id":"http://fluidlog.com/node/3" },
              {index:4, label: "E", "@type":"av:project", x:300, y:400, "@id":"http://fluidlog.com/node/4" },
              {index:5, label: "F", "@type":"av:project", x:500, y:300, "@id":"http://fluidlog.com/node/5" },
              {index:6, label: "G", "@type":"av:project", x:300, y:500, "@id":"http://fluidlog.com/node/6" },
              {index:7, label: "H", "@type":"av:project", x:400, y:500, "@id":"http://fluidlog.com/node/7" },
      ],
      edges: [
              { source: 0, target: 1 },
              { source: 0, target: 2 },
              { source: 0, target: 3 },
              { source: 3, target: 4 },
              { source: 3, target: 5 },
              { source: 3, target: 6 },
              { source: 3, target: 7 },
      ]
}

data[3] = {
      nodes: [
              {index:0, label: "Bienvenue dans la Carto PAIR !", "@type":"av:project", x:300, y:50, "@id":"http://fluidlog.com/node/0" },
              {index:1, label: "Vous pouvez ajouter...", "@type":"av:idea", x:150, y:150, "@id":"http://fluidlog.com/node/1" },
              {index:2, label: "Des Projets", "@type":"av:project", x:300, y:200, "@id":"http://fluidlog.com/node/2" },
              {index:3, label: "Des Acteurs", "@type":"av:actor", x:400, y:200, "@id":"http://fluidlog.com/node/3" },
              {index:4, label: "Des Idées", "@type":"av:idea", x:500, y:200, "@id":"http://fluidlog.com/node/4" },
              {index:5, label: "Des Ressources", "@type":"av:ressource", x:600, y:200, "@id":"http://fluidlog.com/node/5" },
              {index:6, label: "Faire des liens entre les noeuds", "@type":"av:idea", x:300, y:300, "@id":"http://fluidlog.com/node/6" },
              {index:7, label: "Pour cartographier un réseau PAIR à PAIR !", "@type":"av:project", x:600, y:300, "@id":"http://fluidlog.com/node/7" },
              {index:8, label: "Pour plus d'infos, lisez l'aide (menu en haut à droite) !", "@type":"av:ressource", x:500, y:400, "@id":"http://fluidlog.com/node/8" },
      ],
      edges: [
              { source: 0, target: 1 },
              { source: 1, target: 2 },
              { source: 2, target: 3 },
              { source: 3, target: 4 },
              { source: 4, target: 5 },
              { source: 4, target: 6 },
              { source: 4, target: 7 },
              { source: 4, target: 8 },
              { source: 7, target: 8 },
      ]
}

data[4] = {
      nodes: [
              {index:0, label: "Bienvenue dans Fludy !", "@type":"loglink:quoi", x:300, y:50, "@id":"http://fluidlog.com/node/0" },
              {index:1, label: "Vous pouvez ajouter...", "@type":"loglink:quoi", x:150, y:150, "@id":"http://fluidlog.com/node/1" },
              {index:2, label: "Qui", "@type":"loglink:qui", x:300, y:200, "@id":"http://fluidlog.com/node/2" },
              {index:3, label: "Quoi", "@type":"loglink:quoi", x:400, y:200, "@id":"http://fluidlog.com/node/3" },
              {index:4, label: "Pourquoi", "@type":"loglink:pourquoi", x:500, y:200, "@id":"http://fluidlog.com/node/4" },
              {index:5, label: "Ou", "@type":"loglink:ou", x:600, y:200, "@id":"http://fluidlog.com/node/5" },
              {index:6, label: "Comment", "@type":"loglink:comment", x:700, y:200, "@id":"http://fluidlog.com/node/6" },
              {index:7, label: "Quand", "@type":"loglink:quand", x:800, y:200, "@id":"http://fluidlog.com/node/7" },
              {index:8, label: "Combien", "@type":"loglink:combien", x:900, y:200, "@id":"http://fluidlog.com/node/8" },
              {index:9, label: "Faire des liens entre les noeuds", "@type":"loglink:quoi", x:300, y:300, "@id":"http://fluidlog.com/node/9" },
              {index:10, label: "Pour cartographier sémantiquement un réseau d'information !", "@type":"loglink:pourquoi", x:500, y:350, "@id":"http://fluidlog.com/node/10" },
              {index:11, label: "Pour plus d'infos, lisez l'aide (menu en haut à droite) !", "@type":"loglink:comment", x:700, y:400, "@id":"http://fluidlog.com/node/11" },
      ],
      edges: [
              {index:0, "@id" : "http://fluidlog.com/edge/0", "@type":"loglink:linkedto", source: 0, target: 1 },
              {index:1, "@id" : "http://fluidlog.com/edge/1", "@type":"loglink:linkedto", source: 1, target: 2 },
              {index:2, "@id" : "http://fluidlog.com/edge/2", "@type":"loglink:linkedto", source: 2, target: 3 },
              {index:3, "@id" : "http://fluidlog.com/edge/3", "@type":"loglink:linkedto", source: 3, target: 4 },
              {index:4, "@id" : "http://fluidlog.com/edge/4", "@type":"loglink:linkedto", source: 4, target: 5 },
              {index:5, "@id" : "http://fluidlog.com/edge/5", "@type":"loglink:linkedto", source: 5, target: 6 },
              {index:6, "@id" : "http://fluidlog.com/edge/6", "@type":"loglink:linkedto", source: 6, target: 7 },
              {index:7, "@id" : "http://fluidlog.com/edge/7", "@type":"loglink:linkedto", source: 7, target: 8 },
              {index:8, "@id" : "http://fluidlog.com/edge/8", "@type":"loglink:linkedto", source: 3, target: 9 },
              {index:9, "@id" : "http://fluidlog.com/edge/9", "@type":"loglink:linkedto", source: 4, target: 10 },
              {index:10, "@id" : "http://fluidlog.com/edge/10", "@type":"loglink:linkedto", source: 6, target: 11 },
      ]
}

data[5] = {
      nodes: [
        { "@id":"http://fluidlog.com/node/0",
          "@type": "loglink:without",
          index:0,
          label: "",
          hypertext: "",
          x:100,
          y:150,
          },
      ],
      edges: []
}

$.mockjax({
  url : '/data/d3data',
  dataType : 'json',
  responseTime : 1000,
  responseText : data,
});
