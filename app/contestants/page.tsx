"use client";

import { useState, useEffect } from 'react'

export default function Contestants() {

    const [data, setData] = useState(null)

    useEffect(() =>  {
        fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=The_Amazing_Race_32")
            .then(async (response) => {
                const responseText = await response.text()
                console.log(doc)
            },
            (error) => {
                console.log(error)
            })
    }, [])

    const final = []
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
