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
        const choreLi = document.createElement("li")
        choreLi.dataset.choreId = chore.id // good for functionality later - PATCH requests

        choreLi.innerHTML = `
        <h2>${chore.description}</h2> 
        <p>Family Member: ${chore.family_member}</p> 
        <p>Due Date: ${chore.due_date}</p> 
        <p>Priority: ${chore.priority}</p> 
        <button class="delete-btn" data-chore-id="${chore.id}">Delete</button>
        <button class="edit-btn" data-chore-id="${chore.id}">Edit</button>
        <button class="completed-btn" data-chore-id="${chore.id}">Mark as Complete</button>
        `

        toDoList.append(choreLi)
    }

    const submitHandler = () => {
        const choreForm = document.querySelector("#create-chore-form")
        choreForm.addEventListener("submit", function(e){
          e.preventDefault()
          const choreForm = e.target
          //get values out of form
          const familyMember = choreForm["family"].value
          const priority = choreForm["priority"].value        
          const dueDate = choreForm["date"].value     
          const description = choreForm["description"].value 

          const newChore = { family_member: familyMember, due_date: dueDate, description: description, priority: priority }
          
          // PATCH when have id (choreForm.dataset.id is defined)
          // POST when don't have id (choreForm.dataset.id is undefined)
          let method
          let submitUrl = baseUrl
          if(choreForm.dataset.id !== undefined){
              method = "PATCH"
              submitUrl += choreForm.dataset.id // adding id to baseUrl to make request to show
          } else(
              method = "POST"
          )

        choreForm.reset()
        choreForm.dataset.id = undefined // clear out dataset from form

        const options = {
            method: method,
            headers: {
              "content-type": "application/json",
              "accept": "application/json"
            },
            body: JSON.stringify(newChore)
          }
          
          fetch(submitUrl, options)
          .then(response => response.json())
          .then(chore => {
            renderChore(chore, toDoList) 
          })

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
              form.priority.value = priority // *** NOT CHANGING - JUST CLEARING
              const choreId = editButton.parentElement.dataset.choreId
              form.dataset.id = choreId
              //console.log(choreId)
              const btn = document.querySelector(".btn")
              btn.value = "Edit Chore"
            } else if (e.target.matches(".completed-btn")){
                const completedButton = e.target
                if(completedButton.textContent === "Mark as Complete"){
                    const completedList = document.querySelector('#completed-chores')
                    completedList.append(completedButton.parentElement)
                    completedButton.textContent = "Mark as Incomplete"
                } else if (completedButton.textContent === "Mark as Incomplete"){
                    const toDoList = document.querySelector('#to-do-chores')
                    toDoList.append(completedButton.parentElement)
                    completedButton.textContent = "Mark as Complete"
                }
            }
        }) 
    }

    getChores()
    submitHandler()
    clickHandler()

})