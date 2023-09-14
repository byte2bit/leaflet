import { centroid } from "./js/centroids.js";
import { regioes } from "./js/regioes.js";
import { lotes } from "./js/lotes.js";
import { voar } from "./js/voar.js";

export { funcoes, map, filtr, feat, heat };

/***** DECLARAÇÕES *******/
var funcoes = {};
var map = {};
var lista_ra = [];
var linha_ra = [];
var lista_lote = [];
var linha_lote = [];
var soma_tot = [];
var uh_tot = [];
var val_graf = [];
var centerPoint = [];
var linha = "";
var linha2 = "";
var linhaDet = "";
var filtr = [];
var lista_emp = [];
var sm = [];
var feat = poligonos.features;
var heat = {};
var filtr2 = feat.filter((obj) => {
    return obj.properties.Empreendim;
});

/***** DECLARAÇÕES *******/
funcoes.uniq = (a) => {
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}

funcoes.ordena = (ar) => {
    ar.sort((a, b) => {
        //filtrar duplicatas
        if (a[0] === b[0]) {
            return 0;
        } else {
            //ordenar
            return (a[0] < b[0]) ? -1 : 1;
        }
    });
}

/*** Lista RA ********/
var filtr3 = feat.filter((obj) => {
    return obj.properties.Desc_RA;
});
for (let i = 0; i < filtr3.length; i++) {
    lista_ra.push(filtr3[i].properties.Desc_RA)
}

//nomes das barras grafico 1
lista_ra = funcoes.uniq(lista_ra);

//dropdown empreedimentos
for (let i = 0; i < lista_ra.length; i++) {
    linha_ra += `<option value="${lista_ra[i]}">${lista_ra[i]}</option>`;
}
linha_ra = '<option selected="selected">Selecione a Região</option>' + linha_ra;

/*** Lista Lotes ********/
var filtr4 = feat.filter((obj) => {
    return obj.properties.Desc_Modal;
});
for (let i = 0; i < filtr4.length; i++) {
    lista_lote.push(filtr4[i].properties.Desc_Modal)
}

//nomes das barras grafico 1
lista_lote = funcoes.uniq(lista_lote);

//dropdown lotes
for (let i = 0; i < lista_lote.length; i++) {
    linha_lote += `<option value="${lista_lote[i]}">${lista_lote[i]}</option>`;
}
linha_lote = '<option selected="selected">Selecione o Lote</option>' + linha_lote;


/** ORDENAR A LISTA EMPRE**/
for (let i = 0; i < filtr2.length; i++) {
    lista_emp.push([filtr2[i].properties.Id_Empreen, filtr2[i].properties.Desc_Empre, filtr2[i].properties.NroUHProje, filtr2[i].properties.Desc_RA])
}

funcoes.ordena(lista_emp);

for (let i = 0; i < lista_emp.length; i++) {
    linha += `
            <tr>
            <td class="voa"><a href="#">${lista_emp[i][0]}</a></td>
            <td>${lista_emp[i][1]}</td>
            <td>${lista_emp[i][2]}</td>
            </tr>`;

    soma_tot.push(lista_emp[i][1]);
    uh_tot.push(lista_emp[i][2]);

    // centerPoint.push({ lat: centroid(lista_emp[i][0])[1], lng: centroid(lista_emp[i][0])[0] })
    centerPoint.push([centroid(lista_emp[i][0])[1], centroid(lista_emp[i][0])[0]])
}

/****** FUNÇÃO INÍCIO ***********/
var inicio = () => {

    //Camada Geojson
    var polig = L.geoJSON(poligonos, {
        color: '#800000',
        weigth: 3,
    });

    //Camada de mapa base
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });

    //Camada Google Maps
    var satellite = L.gridLayer
        .googleMutant({
            type: "hybrid", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        });

    /**** HEATMAP **************/
    heat = L.heatLayer(centerPoint,
        {
            radius: 7,
            minOpacity: 0.8,
            maxZoom: 18,
            max: 1.5,
            blur: 11,
            // gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
        });
    /******** */

    var baseMaps = {
        "OpenStreetMap": osm
    };

    var overlayMaps = {
        "HeatMap": heat
    };

    if (window.matchMedia('screen and (max-width: 768px)').matches) {
        //Adiciona o mapa e configura vizualização inicial
        //Para celular
        map = L.map('map', {
            center: [-22.254572, -48.383791],
            zoom: 5,
            layers: [osm, polig, heat]
        });
    } else {
        //Para desktop
        map = L.map('map', {
            center: [-22.254572, -48.383791],
            zoom: 7,
            layers: [osm, polig, heat]
        });
    }

    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

    layerControl.addBaseLayer(satellite, "Satélite");

    polig.eachLayer(function (layer) {
        layer.bindPopup(`<center><p>id:${layer.feature.properties.Id_Empreen}</p><p>${layer.feature.properties.Empreendim}</p><p>${layer.feature.properties.Desc_Geren}</p></center>`);
    });
    
    //Botão home
    L.easyButton('fa-home', function () {
        if (window.matchMedia('screen and (max-width: 768px)').matches) {
            map.setView([-22.254572, -48.383791], 5); //celular
        } else {
            map.setView([-22.254572, -48.383791], 7); //desktop
        }
        polig.addTo(map);
        $("#bt_ra").html("Selecione");
    }).addTo(map)

    map.addControl(new L.Control.Fullscreen());

    //Ajustes do heatmap por zoom
    var options = [];
    if (map.getZoom() === 7) {
        options[0] = 7;
        options[1] = 0.8;
    }
    else if (map.getZoom() === 8) {
        options[0] = 4;
        options[1] = 0.8;
    }
    else if (map.getZoom() === 9) {
        options[0] = 6;
        options[1] = 0.8;
    }
    else if (map.getZoom() === 10) {
        options[0] = 8;
        options[1] = 0.8;
    }
    else if (map.getZoom() === 11) {
        options[0] = 10;
        options[1] = 0.8;
    }
    else if (map.getZoom() === 12) {
        options[0] = 12;
        options[1] = 0.8;
    }
    else if (map.getZoom() >= 13) {
        options[0] = 7;
        options[1] = 0;
    }

    map.on('zoomstart', function (ev) {
        console.log("Zoom: ", map.getZoom())
        heat.setOptions({
            radius: options[0],
            minOpacity: options[1],
            maxZoom: 18,
            max: 1.5,
            blur: 11
        });
        heat.redraw();
    });


    // Dados para o grafico 1
    // AINDA VOU TENTAR MELHORAR
    var sma = []
    var smb = []
    var somasub0 = []
    var somasub1 = []
    var somasub2 = []
    var somasub3 = []
    var somasub4 = []
    var somasub5 = []
    var somasub6 = []
    var somasub7 = []
    var somasub8 = []
    var somasub9 = []
    var somasub10 = []
    var somasub11 = []
    var somasub12 = []
    var somasub13 = []

    feat.filter((obj) => {
        for (let i = 0; i < obj.properties.Desc_RA.length; i++) {
            if (obj.properties.Desc_RA === lista_ra[i]) {
                // smb = smb[i];
                return smb.splice(i, 0, obj.properties.NroUHProje);
            }
        }
    });

    feat.filter((obj) => {

        if (obj.properties.Desc_RA === lista_ra[0]) { somasub0.push([0, obj.properties.NroUHProje]); return sma[0] = somasub0; }
        if (obj.properties.Desc_RA === lista_ra[1]) { somasub1.push([1, obj.properties.NroUHProje]); return sma[1] = somasub1; }
        if (obj.properties.Desc_RA === lista_ra[2]) { somasub2.push([2, obj.properties.NroUHProje]); return sma[2] = somasub2; }
        if (obj.properties.Desc_RA === lista_ra[3]) { somasub3.push([3, obj.properties.NroUHProje]); return sma[3] = somasub3; }
        if (obj.properties.Desc_RA === lista_ra[4]) { somasub4.push([4, obj.properties.NroUHProje]); return sma[4] = somasub4; }
        if (obj.properties.Desc_RA === lista_ra[5]) { somasub5.push([5, obj.properties.NroUHProje]); return sma[5] = somasub5; }
        if (obj.properties.Desc_RA === lista_ra[6]) { somasub6.push([6, obj.properties.NroUHProje]); return sma[6] = somasub6; }
        if (obj.properties.Desc_RA === lista_ra[7]) { somasub7.push([7, obj.properties.NroUHProje]); return sma[7] = somasub7; }
        if (obj.properties.Desc_RA === lista_ra[8]) { somasub8.push([8, obj.properties.NroUHProje]); return sma[8] = somasub8 }
        if (obj.properties.Desc_RA === lista_ra[9]) { somasub9.push([9, obj.properties.NroUHProje]); return sma[9] = somasub9; }
        if (obj.properties.Desc_RA === lista_ra[10]) { somasub10.push([10, obj.properties.NroUHProje]); return sma[10] = somasub10; }
        if (obj.properties.Desc_RA === lista_ra[11]) { somasub11.push([11, obj.properties.NroUHProje]); return sma[11] = somasub11; }
        if (obj.properties.Desc_RA === lista_ra[12]) { somasub12.push([12, obj.properties.NroUHProje]); return sma[12] = somasub12; }
        if (obj.properties.Desc_RA === lista_ra[13]) { somasub13.push([13, obj.properties.NroUHProje]); return sma[13] = somasub13; }
    });
    /*     for (let [key, value] of Object.entries(sma)) {
            console.log(key, value);
        } */
    // console.log(sma);

    function reduce2dArr(cash) {
        return cash.reduce((sum, subArray) => sum + subArray[1], 0);
    }

    for (let i = 0; i < 14; i++) {
        sm[i] = reduce2dArr(sma[i]);
        val_graf.push(sm[i]); //valores para o grafico 1
    }
    /*     for (let i = 0; i < 14; i++) {
            sm[i] = reduce2dArr(smb[i]);
            vg.push(sm[i]); //valores para o grafico 1
        } */

    /*     smb.list.forEach(function (obj) {
            for (var i in obj) {
                if (obj[i] === null) {
                    obj[i] = '';
                }
            }
        });
    
        console.log("smb: "+smb); */
    //console.log("sma: " + sma);

    /*********************************/

    $("#q_emp").html(soma_tot.length);

    var somat = uh_tot.reduce((a, b) => (a + b));
    $("#q_uh").html(somat.toLocaleString());

    //dropdown empreedimentos
    for (let i = 0; i < feat.length; i++) {
        linha2 += `
    <option value="${lista_emp[i][0]}">
    ${lista_emp[i][0]}: ${lista_emp[i][1]}</option>
    `;
    }
    linha2 = '<option selected="selected">Selecione o Empreendimento</option>' + linha2;

    $('#drop-emp').on('change', function () {
        var id = this.value;
        var geoLat = centroid(id)[1];
        var geoLong = centroid(id)[0];

        map.flyTo([geoLat, geoLong], 16);

        filtr = feat.filter((obj) => {
            return obj.properties.Id_Empreen == id;
        });

        linhaDet = "";
        linhaDet += `
        <tr><td>EMPREENDIMENTO: </td><td>${filtr[0].properties.Desc_Empre}</td></tr>
        <tr><td>ID: </td><td>${filtr[0].properties.Id_Empreen}</td></tr>
        <tr><td>DESCRIÇÃO: </td><td>${filtr[0].properties.Desc_Statu}</td></tr>
        <tr><td>BASE PROJETO APROVAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_1}</td></tr>
        <tr><td>AUTUAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_2}</td></tr>
        <tr><td>PE/PA: </td><td>${filtr[0].properties.Desc_Statu_3}</td></tr>
        <tr><td>APROVAÇÃO ESTADUAL: </td><td>${filtr[0].properties.Desc_Statu_4}</td></tr>
        <tr><td>APROVAÇÃO PM: </td><td>${filtr[0].properties.Desc_Statu_5}</td></tr>
        <tr><td>APROVAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_6}</td></tr>
        <tr><td>AVERBAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_7}</td></tr>
        `;
        $("#tdet").html(linhaDet);
    });
}


//grafico 1
Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
    color: 'yellow'
});

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: lista_ra,
        datasets: [{
            label: 'Gráfico UHs x Região Adm.',
            data: val_graf,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: "#ffffff"
                }
            },
            datalabels: {
                anchor: 'end',
                align: 'end'
            },
            beforeDraw: function (c) {
                var chartHeight = c.chart.height;
                var size = chartHeight * 5 / 100;
                c.scales['y-axis-0'].options.ticks.minor.fontSize = size;
            },
            /*             colorschemes: {
                            scheme: 'brewer.RdYlBu11'
                        } */
        },
        scales: {
            yAxes: {
                ticks: {
                    color: "#ffffff",
                    /* Keep y-axis width proportional to overall chart width */
                    afterFit: function (scale) {
                        var chartWidth = scale.chart.width;
                        var new_width = chartWidth * 0.4;

                        scale.width = new_width;
                    }
                },
            },
            xAxes: {
                ticks: {
                    color: "#ffffff"
                },
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 30
            }
        }
    }
});


/** FUNÇÃO PAGINA PRONTA **/
$(function () {
    inicio();
    $("#tbody").html(linha);
    $("#drop-emp").html(linha2);
    $("#lista_ra").html(linha_ra);
    $("#lista_lote").html(linha_lote);
    voar();
    regioes();
    lotes();
    if (window.matchMedia('screen and (max-width: 768px)').matches) {
        $("#rodape").detach().appendTo("#conteudo");
        $("#centro-tab-2").click(() => {
            $(".right-sidebar").css("display", "none");
            $("#centro-content").css("height", "calc(100vh - 380px)");
        })
        $("#maps").click(() => {
            $(".right-sidebar").css("display", "block");
            $("#centro-content").css("height", "calc(100vh - 570px)");
        })
    }
})
