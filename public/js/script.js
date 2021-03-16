// var teste = fetch('/api/teste', {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         teste: "teste"
//     })
// }).then((res) => res.json())
// .then((res) => {
//     console.log(res)
// })


const section = document.querySelector('section')
// Shop
const shopBtn = document.querySelector('#shop')
shopBtn.addEventListener('click', shop);

function shop() {
    section.innerHTML = ''

    // Criar tab
    let tab = document.createElement('div')
    tab.setAttribute('id', 'tab')

    // h1s
    let buyTitle = document.createElement('h1')
    buyTitle.innerText = 'BUY'

    let sellTitle = document.createElement('h1')
    sellTitle.innerText = 'SELL'

    // slots
    let slots = document.createElement('div')
    slots.setAttribute('class', 'slots')

    let sellSlots = document.createElement('div')
    sellSlots.setAttribute('class', 'slots')

    fetch('/api/shop').then((res) => res.json())
    .then((items) => {
        for(item of items) {
            if(item.type == 1) {
                let itemSlot = document.createElement('div')
                itemSlot.setAttribute('class', 'tool')
                slots.appendChild(itemSlot)

                let itemImg = document.createElement('img')
                itemImg.setAttribute('src', item.picture + '.png')
                itemImg.setAttribute('id', item._id)
                itemImg.setAttribute('title', item.name + ' | ' + item.description + ' | Price: ' + item.price + 'c')

                itemSlot.appendChild(itemImg)
            }
        }

        for(item of items) {
            if(item.type == 2) {
                let itemSlot = document.createElement('div')
                itemSlot.setAttribute('class', 'tool')
                sellSlots.appendChild(itemSlot)
    
                let itemImg = document.createElement('img')
                itemImg.setAttribute('src', item.picture + '.png')
                itemImg.setAttribute('id', item._id)
                itemImg.setAttribute('title', item.name + ' | ' + item.description + ' | Price: ' + item.price + 'c')
    
                itemSlot.appendChild(itemImg)
            }
        }
    })

    // exit
    let exitBtn = createExitBtn()

    // append order
    section.appendChild(tab)

    tab.appendChild(buyTitle)
    tab.appendChild(slots)
    tab.appendChild(sellTitle)
    tab.appendChild(sellSlots)
    tab.appendChild(exitBtn)
}

// Friends
const friendBtn = document.querySelector('#friends')
friendBtn.addEventListener('click', friendlist);

function friendlist() {
    section.innerHTML = ''

    // Criar tab
    let tab = document.createElement('div')
    tab.setAttribute('id', 'tab')
    
    let title = document.createElement('h1')
    title.innerText = 'FRIENDS'

    let slots = document.createElement('ul')
    slots.setAttribute('class', 'friendlist')

    let friendSearch = document.createElement('input')
    friendSearch.setAttribute('class', 'friend')
    friendSearch.setAttribute('type', 'text')
    friendSearch.setAttribute('name', 'username')
    slots.appendChild(friendSearch)

    let friendAdd = document.createElement('span')
    friendAdd.setAttribute('id', 'send')
    friendAdd.innerText = '✉'
    slots.appendChild(friendAdd)

    friendAdd.addEventListener('click', () => {
        fetch('/api/friendship/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: friendSearch.value
            })
        })
    })

    fetch('/api/friendship').then((res) => res.json())
    .then((userFriend) => {
        for(user of userFriend) {
            let friend = document.createElement('li')
            friend.setAttribute('class', 'friend')
            friend.innerText = user.userB.name

            let deleteFriend = document.createElement('span')
            deleteFriend.setAttribute('class', 'deleteBtn')
            deleteFriend.setAttribute('id', user.userB._id)
            deleteFriend.innerText = 'X'

            slots.appendChild(friend)
            slots.appendChild(deleteFriend)
        }
    })

    // exit
    let exitBtn = createExitBtn()

    // append order
    section.appendChild(tab)

    tab.appendChild(title)
    tab.appendChild(slots)
    tab.appendChild(exitBtn)
}

// Skills
const skillsBtn = document.querySelector('#skills')
skillsBtn.addEventListener('click', skills);

function skills() {
    section.innerHTML = ''

    // Criar tab
    let tab = document.createElement('div')
    tab.setAttribute('id', 'tab')
    
    let title = document.createElement('h1')
    title.innerText = 'SKILLS'

    let slots = document.createElement('div')
    slots.setAttribute('class', 'slots')

    fetch('/api/skill').then((res) => res.json())
    .then((unlockedSkills) => {
        for(unlocked of unlockedSkills) {
            let itemSlot = document.createElement('div')
            itemSlot.setAttribute('class', 'tool')
            slots.appendChild(itemSlot)

            let itemImg = document.createElement('img')
            itemImg.setAttribute('src', unlocked.skill.picture + '.png')
            itemImg.setAttribute('id', unlocked.skill._id)
            itemImg.setAttribute('title', unlocked.skill.name + ' | ' + unlocked.skill.description + ' | Cooldown: ' + unlocked.skill.cooldown + 's')

            itemSlot.appendChild(itemImg)
        }
    })

    // exit
    let exitBtn = createExitBtn()

    // append order
    section.appendChild(tab)

    tab.appendChild(title)
    tab.appendChild(slots)
    tab.appendChild(exitBtn)
}

// Craft
const craftBtn = document.querySelector('#craft')
craftBtn.addEventListener('click', craft);

function craft() {
    section.innerHTML = ''

    // Criar tab
    let tab = document.createElement('div')
    tab.setAttribute('id', 'tab')
    
    let title = document.createElement('h1')
    title.innerText = 'CRAFT'

    let slots = document.createElement('div')
    slots.setAttribute('class', 'slots')

    fetch('/api/craft').then((res) => res.json())
    .then((craftItems) => {
        console.log(craftItems)
    })

    for(let i = 0; i < 3; i++) {
        let itemSlot = document.createElement('div')
        itemSlot.setAttribute('class', 'tool')
        slots.appendChild(itemSlot)

        let itemImg = document.createElement('img')
        itemImg.setAttribute('src', 'img/weapon1.png')

        itemSlot.appendChild(itemImg)
    }

    // exit
    let exitBtn = createExitBtn()

    // append order
    section.appendChild(tab)

    tab.appendChild(title)
    tab.appendChild(slots)
    tab.appendChild(exitBtn)
}

// Exit

function createExitBtn() {
    var exitBtn = document.createElement('div')
    exitBtn.setAttribute('class', 'exit')
    exitBtn.innerText = 'X'
    
    exitBtn.addEventListener('click', refresh)

    return exitBtn
}

// Refresh

function refresh() {
    section.innerHTML = ''

    let pveArea = document.createElement('div')
    pveArea.setAttribute('id', 'pve')

    let mobName = document.createElement('h1')
    mobName.setAttribute('id', 'mob-name')
    mobName.innerText = 'Nome do Mob'

    let mobLife = document.createElement('div')
    mobLife.setAttribute('id', 'lifebar')
    mobLife.innerText = '0/100'

    let mobSprite = document.createElement('img')
    mobSprite.setAttribute('class', 'mob-pic')
    mobSprite.setAttribute('src', 'img/mob/tree.png')

    section.appendChild(pveArea)

    pveArea.appendChild(mobName)
    pveArea.appendChild(mobLife)
    pveArea.appendChild(mobSprite)
}