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
        }).then((res) => res.json())
        .then((res) => {
            if(res.added == true) {
                addFriendSlot(friendSearch.value, res.friend._id, slots)
            }
        })
    })

    fetch('/api/friendship').then((res) => res.json())
    .then((userFriend) => {
        for(user of userFriend) {
            addFriendSlot(user.userB.name, user.userB._id, slots)
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

        for(let i = 0; i < 3; i++) {
            let item
            if(i == 0) {
                item = craftItems[0].pickaxe
            }
            if(i == 1) {
                item = craftItems[0].sword
            }
            if(i == 2) {
                item = craftItems[0].axe
            }

            let itemSlot = document.createElement('div')
            itemSlot.setAttribute('class', 'tool')
            slots.appendChild(itemSlot)

            let itemImg = document.createElement('img')
            itemImg.setAttribute('src', item.picture + '.png')
            itemImg.setAttribute('id', item._id)
            itemImg.setAttribute('title', item.name + ' | ' + item.description + ' | ' + 
                                  item.material.name + ': ' + item.amount + ' | Wood: ' + item.wood)

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

// Exit

function createExitBtn() {
    var exitBtn = document.createElement('div')
    exitBtn.setAttribute('class', 'exit')
    exitBtn.innerText = 'X'
    
    exitBtn.addEventListener('click', refresh)

    return exitBtn
}

function addFriendSlot(name, id, tabElement) {
    let friend = document.createElement('li')
    friend.setAttribute('class', 'friend')
    friend.innerText = name

    let deleteFriend = document.createElement('span')
    deleteFriend.setAttribute('class', 'deleteBtn')
    deleteFriend.setAttribute('id', id)
    deleteFriend.innerText = 'X'

    deleteFriend.addEventListener('click', () => {
        fetch('/api/friendship/del', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                friend: id
            })
        })

        tabElement.removeChild(friend)
        tabElement.removeChild(deleteFriend)
    })

    tabElement.appendChild(friend)
    tabElement.appendChild(deleteFriend)
}

// Refresh

function refresh() {
    section.innerHTML = ''

    fetch('/api/currentFight').then((res) => res.json())
    .then((currentFight) => {
        let fight = currentFight
        let pveArea = document.createElement('div')
        pveArea.setAttribute('id', 'pve')

        let mobName = document.createElement('h1')
        mobName.setAttribute('id', fight.mob._id)
        mobName.innerText = fight.mob.name

        var mobLife = document.createElement('div')
        mobLife.setAttribute('id', 'lifebar')
        
        let lifebar = (fight.hp / fight.mob.hp) * 100
        mobLife.innerText = fight.hp + '/' + fight.mob.hp
        mobLife.style.width = lifebar + '%'

        let mobSprite = document.createElement('img')
        mobSprite.setAttribute('class', 'mob-pic')
        mobSprite.setAttribute('src', fight.mob.picture + '.png')

        section.appendChild(pveArea)

        pveArea.appendChild(mobName)
        pveArea.appendChild(mobLife)
        pveArea.appendChild(mobSprite)

        document.querySelector('.mob-pic').addEventListener('click', damage)
    })
}

document.querySelector('.mob-pic').addEventListener('click', damage)

function damage() {
    fetch('/api/currentFight').then((res) => res.json())
    .then((fight) => {

        fetch('/api/equip').then((res) => res.json())
        .then((equip) => {
            let tool
            switch(fight.mob.type) {
                case 1:
                    tool = equip.axe
                    break
                case 2:
                    tool = equip.pickaxe
                    break
                case 3:
                    tool = equip.sword
                    break
            }

            let remainingHP = fight.hp - tool.damage

            if(remainingHP > 0) {
                fetch('/api/currentFight/dmgRegister', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        hp: remainingHP
                    })
                })
                refresh()
                
            } else {
                let tools = [equip.axe, equip.pickaxe, equip.sword]
                let averageItemLevel = 0
                let index = 0
                for(item of tools) {
                    if(item != null) {
                        index++
                        averageItemLevel += item.level
                    }
                }
                averageItemLevel /= index

                fetch('/api/log/add', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        killLog: fight.mob.type
                    })
                }).then((res) => res.json())
                .then((log) => {
                    let logElement = document.querySelector('#mob-type-tab')

                    logElement.innerHTML = "<span class='mob-type'>" + log.tree + " Tree</span><span class='mob-type'>" + log.stone  + " Stone</span><span class='mob-type'>" + log.monster + " Monster</span>"
                })

                fetch('/api/currentFight/new', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        level: averageItemLevel
                    })
                })
                
                refresh()
            }
        })

    })
}