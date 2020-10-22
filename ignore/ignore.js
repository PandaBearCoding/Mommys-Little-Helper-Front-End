/*
document.addEventListener("DOMContentLoaded", () => {
    
    baseUrl = "http://localhost:3000/api/v1/chores/"
    goalUrl = "http://localhost:3000/api/v1/goals/"
    
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
        <h2 id="desc">${chore.description}</h2> 
        <p id="fam">Family Member: ${chore.family_member}</p> 
        <p id="dd">Due Date: ${chore.due_date}</p> 
        <p id="pri">Priority: ${chore.priority}</p> 
        <p hidden id="status">Incomplete</p> 
        <button class="delete-btn" data-chore-id="${chore.id}">Delete</button>
        <button class="edit-btn" data-chore-id="${chore.id}">Edit</button>
        <button class="completed-btn" data-chore-id="${chore.id}">Mark as Complete</button>
        ` 
        
        toDoList.append(choreLi)
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

    
    const getGoals = () => {
        fetch(goalUrl)
        .then (response => response.json())
        .then(goals => {
            renderGoals(goals)
      })
    }

    const renderGoals = goals => {
        goalList = document.querySelector("#goal-list")
        for(const goal of goals){
          renderGoal(goal, goalList)
        }
    }

    const renderGoal = (goal, goalList) => {
        const goalLi = document.createElement("li")
        goalLi.dataset.goalId = goal.id

        goalLi.innerHTML = `
        <h2 id="reward">${goal.reward}</h2> 
        <p id="due">Due Date: ${goal.date}</p> 
        <button class="ed-button" data-goal-id="${goal.id}">Edit</button>
        <button class="del-button" data-goal-id="${goal.id}">Delete</button>
        `
        goalList.append(goalLi)
    }

    const renderEditGoal = (goalId, newGoal, goalForm)  => {
        const goalLi = document.querySelector(`[data-goal-id="${goalId}"]`)
        const reward = goalLi.querySelector("#reward")
        reward.textContent = newGoal.reward
        const date = goalLi.querySelector("#due")
        date.textContent = `Due Date: ${newGoal.date}`
        const btn = document.querySelector(".buttn")
        btn.value = "Create Goal"
        goalForm.reset()
        goalForm.dataset.id = "creating"
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
              
              const newChore = { family_member: familyMember, due_date: dueDate, description: description, priority: priority }
              
              // PATCH when have id (choreForm.dataset.id is defined)
              // POST when don't have id (choreForm.dataset.id is undefined)
              
              let method
              let submitUrl = baseUrl
              console.log("outside", choreForm)

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
                console.log("inside", choreForm.dataset.id)
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
                
                // choreForm.reset()
                // choreForm.dataset.id = undefined // clear out dataset from form
                
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
            } else if(e.target.matches("#create-goal-form")){
                
                const goalForm = e.target
                const reward = goalForm["reward"].value        
                const date = goalForm["date"].value     
                
                const newGoal = { reward: reward, date: date }

                let method
                let submitGoalUrl = goalUrl
                
                if(goalForm.dataset.id === "creating"){
                    
                    method = "POST"
                    
                    const options = {
                        method: method,
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify(newGoal)
                    }
                
                createGoal(options)
                }
                else if(goalForm.dataset.id !== "creating"){
                    method = "PATCH"
                    submitGoalUrl += goalForm.dataset.id
                    
                    const options = {
                        method: method,
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify(newGoal)
                    }
                    
                    editGoal(goalForm.dataset.id, options)  
                } 
                
                function createGoal(options){
                    fetch(submitGoalUrl, options)
                    .then(response => response.json())
                    .then(goal => {
                        renderGoal(goal, goalList) 
                    })
                }

                function editGoal(goalId, options){
                    fetch(submitGoalUrl, options)
                    .then(response => response.json())
                    .then(renderEditGoal(goalId, newGoal, goalForm))
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
                    const status = completedButton.parentElement.querySelector("#status")
                    status.textContent = "Complete"
                    //completedButton.parentElement.status = "Complete"
                    completedButton.textContent = "Mark as Incomplete"

                    // let submitUrl = baseUrl += completedButton.parentElement.dataset.id

                    
                    // const options = {
                    //     method: "PATCH",
                    //     headers: {
                    //         "content-type": "application/json",
                    //         "accept": "application/json"
                    //     },
                    //     body: JSON.stringify(completedButton.parentElement)
                    // }

                    // editStatus(completedButton.parentElement.dataset.id, options)


                    // function editStatus(options){
                    //     fetch(submitUrl, options)
                    //     .then(response => response.json())
                    // }

                      

            




                } else if(completedButton.textContent === "Mark as Incomplete"){
                    const choreId = completedButton.parentElement.dataset.choreId
                    const toDoList = document.querySelector('#to-do-chores')
                    toDoList.append(completedButton.parentElement)
                    completedButton.textContent = "Mark as Complete"
            
                } 
            } else if(e.target.matches(".del-button")){
                const delButton = e.target
                const goalId = delButton.parentElement.dataset.goalId
                
                const options = {
                  method: "DELETE"
                }
                
                fetch(goalUrl + goalId, options)
                .then(response => response.json())
                .then(_data => {
                  delButton.parentElement.remove()
                })
             } else if(e.target.matches(".ed-button")){
                const editButton = e.target
                const li = editButton.parentElement
                const child = li.children
                const reward = child[0].textContent
                const date = child[1].textContent.split(": ")[1]
                const goalForm = document.querySelector("#create-goal-form")
                goalForm.reward.value = reward
                goalForm.date.value = date
                const goalId = editButton.parentElement.dataset.goalId
                goalForm.dataset.id = goalId
                const submitBtn = document.querySelector(".buttn")
                submitBtn.value = "Edit Goal"
            }
        }) 
    }

    getChores()
    submitHandler()
    clickHandler()
    getGoals()

})

*/