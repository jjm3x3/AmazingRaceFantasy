async function getData() {

    const aList = [ "Derek & Claire", "Emily & Molly", "Luis & Michelle", "Aubrey & David", "Marcus & Michael", "Quinton & Mattie", "Glenda & Lumumba", "Abby & Will", "Linton & Sharik", "Rich & Dom", "Tim & Rex", "Aashta & Nina" ]
    const response = await fetch("https://en.wikipedia.org/wiki/The_Amazing_Race_35")
    console.log("Reponse got...")
    const responseText = await response.text()
    console.log("Text of web query" + responseText)

    return { props: { runners: aList } }
}

export default async function Contestants() {

    const final = await getData()

    return (
        <div>
          <h1 className="text-2xl text-center">Contestants This Season</h1>
          <br/>
          <p className="text-lg text-center">{final.props.runners.length} teams</p>
          <br/>
          <div className="text-center">
              {final.props.runners.map(t => <p key={t}>{t}</p>)}
          </div>
        </div>
    )
}
