export function centroid(idEmp) {
    var n = poligonos.features
    var filtrado = n.filter((obj) => {
        return obj.properties.Id_Empreen == idEmp;
    })
    var coordFilt = filtrado[0].geometry.coordinates
    //calculo media longitude
    var ListLong = []
    for (let p = 0; p < coordFilt.length; p++) {
        for (let p1 = 0; p1 < coordFilt[p].length; p1++) {
            for (let p2 = 0; p2 < coordFilt[p][p1].length-1; p2++) {
                ListLong.push(coordFilt[p][p1][p2][0])
                var medLong = ListLong.reduce((a, b) => (a + b)) / ListLong.length
            };
        };
    }
    //calculo media latitude
    var ListLat = []
    for (let p = 0; p < coordFilt.length; p++) {
        for (let p1 = 0; p1 < coordFilt[p].length; p1++) {
            for (let p2 = 0; p2 < coordFilt[p][p1].length-1; p2++) {
                ListLat.push(coordFilt[p][p1][p2][1])
                var medLat = ListLat.reduce((a, b) => (a + b)) / ListLat.length
            };
        };
        
    }
    return [medLong, medLat]
}