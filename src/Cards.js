import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import Card from './Card'
import './Cards.css';

const Cards = () => {

    let deckRef = useRef()
    const divRef = useRef()
    const errorRef = useRef()
    const firstRun = useRef(true)
    let intervalId = useRef()

    const [startTimer, setStartTimer] = useState(false)
    const [cards, setCards] = useState([])
    const [draw, setDraw] = useState(false)
    const [disableButton, setDisableButton] = useState(false)

    useEffect(() => {
        async function getDeck() {
            const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            deckRef.current = res.data.deck_id
        }
        getDeck()
    }, [startTimer])

    const drawOne = () => {
        firstRun.current = false
        setDraw(!draw)
    }
    useEffect(() => {
        async function drawCard() {
            if (cards.length == 51) {
                errorRef.current.innerText = "Error: no cards remaining!"
                setDisableButton(true)
            } else {
                const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckRef.current}/draw/?count=1`)
                // put card on the deck
                const rand = Math.floor(Math.random() * 90)
                const style = { transform: `rotate(${rand}deg)` }
                setCards(cards => {
                    return [...cards, { img: res.data.cards[0].images.png, code: res.data.cards[0].code, style: style }]
                })
            }
        }

        if (!firstRun.current) {
            drawCard()
        }
    }, [draw])


    // const [stop, setStop] = useState(false)


    useEffect(() => {
        if (startTimer) {
            intervalId.current = setInterval(async () => {

                if (cards.length == 10) {
                    errorRef.current.innerText = "Error: no cards remaining!"
                    setDisableButton(true)
                    return clearInterval(intervalId.current)
                } else {
                    const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckRef.current}/draw/?count=1`)
                    // put card on the deck
                    const rand = Math.floor(Math.random() * 90)
                    const style = { transform: `rotate(${rand}deg)` }
                    setCards(cards => {
                        return [...cards, { img: res.data.cards[0].images.png, code: res.data.cards[0].code, style: style }]
                    })

                }
            }, 1000)
        }
    }, [startTimer])



    return (

        <>
            <div className="Cards-buttons">
                <p id='error' ref={errorRef} ></p>
                <button onClick={drawOne} disabled={disableButton}>Gimme a Card!</button><button onClick={() => setStartTimer(true)}>Draw every second</button>
            </div>
            <div className='Cards' ref={divRef}>
                {cards.map(c => {
                    console.log('running card')
                    return < Card img={c.img} key={c.code} style={c.style} />
                })}
            </div>
        </>
    )
}

export default Cards