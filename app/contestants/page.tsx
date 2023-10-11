export default function Contestants() {

    const final = [ "Derek & Claire", "Emily & Molly", "Luis & Michelle", "Aubrey & David", "Marcus & Michael", "Quinton & Mattie", "Glenda & Lumumba", "Abby & Will", "Linton & Sharik", "Rich & Dom", "Tim & Rex", "Aashta & Nina" ]

    return (
        <div>
          <h1 className="text-2xl text-center">Contestants This Season</h1>
          <br/>
          <p className="text-lg text-center">{final.length} teams</p>
          <br/>
          <div className="text-center">
              {final.map(t => <p>{t}</p>)}
          </div>
        </div>
    )
}
