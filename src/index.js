document.addEventListener("DOMContentLoaded", () => {
    
    baseUrl = "http://localhost:3000/api/v1/chores/"
    
    const getChores = () => {
        fetch(baseUrl)
        .then (response => response.json())
        .then(chores => {
            renderChores(chores)
      })
    }

    const renderChores = chores => {
        toDoList = document.querySelector("#to-do-chores")
        for(const chore of chores){
          renderChore(chore, toDoList)
        }
    }

    const renderChore = (chore, toDoList) => {
        const completedList = document.querySelector("#completed-chores")
        const choreLi = document.createElement("li")
        choreLi.dataset.choreId = chore.id // good for functionality later - PATCH requests

        choreLi.dataset.status = chore.status

        choreLi.innerHTML = `
        <h2 id="desc">${chore.description}</h2> 
        <p id="fam">Family Member: ${chore.family_member}</p> 
        <p id="dd">Due Date: ${chore.due_date}</p> 
        <p id="pri">Priority: ${chore.priority}</p> 
        <button class="delete-btn" data-chore-id="${chore.id}">Delete</button>
        <button class="edit-btn" data-chore-id="${chore.id}">Edit</button>
        <button class="completed-btn" data-chore-id="${chore.id}">Mark as Complete</button>
        ` 
        // once created - incomplete - status is true; if status = true, append to to-do-list
        if(chore.status){
            toDoList.append(choreLi)
        }else{
            completedList.append(choreLi)
        }
    }

    const renderEditChore = (choreId, newChore, choreForm) => {
        // get object from PATCH, find corresponding LI
        const choreLi = document.querySelector(`[data-chore-id="${choreId}"]`)
        // update properties
        const description = choreLi.querySelector("#desc")
        description.textContent = newChore.description
        const family = choreLi.querySelector("#fam")
        family.textContent = `Family Member: ${newChore.family_member}`
        const date = choreLi.querySelector("#dd")
        date.textContent = `Due Date: ${newChore.due_date}`
        const priority = choreLi.querySelector("#pri")
        priority.textContent = `Priority: ${newChore.priority}`  
        const btn = document.querySelector(".btn")
        btn.value = "Create Chore"
        choreForm.reset()
        choreForm.dataset.id = "create"
    }
    
    const submitHandler = () => {
        document.addEventListener("submit", function(e){
          e.preventDefault()
          if(e.target.matches("#create-chore-form")){
              const choreForm = e.target
              //get values out of form
              const familyMember = choreForm["family"].value
              const priority = choreForm["priority"].value        
              const dueDate = choreForm["date"].value     
              const description = choreForm["description"].value 
              
              const newChore = { family_member: familyMember, due_date: dueDate, description: description, priority: priority, status: false }
              
              // PATCH when have id (choreForm.dataset.id is defined)
              // POST when don't have id (choreForm.dataset.id is undefined)
              
              let method
              let submitUrl = baseUrl

              if(choreForm.dataset.id === "create"){
                console.log("POST")
                method = "POST"
                
                const options = {
                    method: method,
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify(newChore)
                }
                
                createChore(options)

             }
             else if(choreForm.dataset.id !== "create"){
                  method = "PATCH"
                  submitUrl += choreForm.dataset.id // adding id to baseUrl to make request to show
                  
                  const options = {
                      method: method,
                      headers: {
                          "content-type": "application/json",
                          "accept": "application/json"
                        },
                        body: JSON.stringify(newChore)
                    }
                    
                    editChore(choreForm.dataset.id, options)
                } 
                
                function editChore(choreId, options){
                    fetch(submitUrl, options)
                    .then(response => response.json())
                    .then(renderEditChore(choreId, newChore, choreForm))
                }
                
                function createChore(options){
                    fetch(submitUrl, options)
                    .then(response => response.json())
                    .then(chore => {
                        renderChore(chore, toDoList) 
                    })
                    choreForm.reset()
                }
            }
        })
    }

    const clickHandler = () => {
        document.addEventListener("click", function(e){
          if(e.target.matches(".delete-btn")){
            const deleteButton = e.target
            const choreId = deleteButton.parentElement.dataset.choreId
            
            const options = {
              method: "DELETE"
            }
            
            fetch(baseUrl + choreId, options)
            .then(response => response.json())
            .then(_data => {
              deleteButton.parentElement.remove()
            })
          } else if(e.target.matches(".edit-btn")){
              const editButton = e.target
              //const choreId = editButton.parentElement.dataset.choreId
              const li = editButton.parentElement
              const child = li.children
              //console.log(child) //--> HTMLCollection
              const description = child[0].textContent
              const familyMember = child[1].textContent.split(": ")[1]
              const dueDate = child[2].textContent.split(": ")[1]
              const priority = child[3].textContent.split(": ")[1]
              //console.log(description, familyMember, dueDate, priority)
              const form = document.querySelector("#create-chore-form")
              //console.log(form)
              form.description.value = description
              form.family.value = familyMember
              form.date.value = dueDate
              form.priority.value = priority
              const choreId = editButton.parentElement.dataset.choreId
              form.dataset.id = choreId
              //console.log(choreId)
              const btn = document.querySelector(".btn")
              btn.value = "Edit Chore"
              //console.log("it's been clicked")
            } else if (e.target.matches(".completed-btn")){
                const completedButton = e.target
                if(completedButton.textContent === "Mark as Complete"){
                    const completedList = document.querySelector('#completed-chores')
                    completedList.append(completedButton.parentElement)
                    completedButton.textContent = "Mark as Incomplete"
                    
                    // find status & change value
                    const li = completedButton.parentElement
                    console.log(li)
                    li.dataset.status = false
                    // do PATCH to change in DB

                    let completeUrl = baseUrl + completedButton.parentElement.dataset.choreId

                    const options = {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify({ status: false })
                    }
                    
                    fetch(completeUrl, options)
                    .then(response => response.json())

    
                    completedList.append(li)
                

                } else if(completedButton.textContent === "Mark as Incomplete"){
                    const choreId = completedButton.parentElement.dataset.choreId
                    const toDoList = document.querySelector('#to-do-chores')
                    toDoList.append(completedButton.parentElement)
                    completedButton.textContent = "Mark as Complete"

                    // find status & change value
                    const li = completedButton.parentElement
                    li.dataset.status = true
                    // do PATCH to change in DB

                    let completeUrl = baseUrl + completedButton.parentElement.dataset.choreId

                    const options = {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify({ status: true })
                    }
                    
                    fetch(completeUrl, options)
                    .then(response => response.json())

                    toDoList.append(li)

                } 
            }
        }) 
    }

    getChores()
    submitHandler()
    clickHandler()

})