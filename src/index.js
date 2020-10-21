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
        <h2 id="desc">${chore.description}</h2> 
        <p id="fam">Family Member: ${chore.family_member}</p> 
        <p id="dd">Due Date: ${chore.due_date}</p> 
        <p id="pri">Priority: ${chore.priority}</p> 
        <button class="delete-btn" data-chore-id="${chore.id}">Delete</button>
        <button class="edit-btn" data-chore-id="${chore.id}">Edit</button>
        <button class="completed-btn" data-chore-id="${chore.id}">Mark as Complete</button>
        `

        toDoList.append(choreLi)
    }

    const renderEdit = (choreId, newChore) => {
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
        console.log(priority.textContent) 
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

              const options = {
                method: method,
                headers: {
                  "content-type": "application/json",
                  "accept": "application/json"
                },
                body: JSON.stringify(newChore)
              }

              editChore(choreForm.dataset.id, options)
          } else{
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

        choreForm.reset()
        choreForm.dataset.id = undefined // clear out dataset from form

        function editChore(choreId, options){
            fetch(submitUrl, options)
            .then(response => response.json())
            .then(renderEdit(choreId, newChore))
        }
          
        function createChore(options){
            fetch(submitUrl, options)
            .then(response => response.json())
            .then(chore => {
              renderChore(chore, toDoList) 
            })
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
                    // INCREASE POINTS BY 2
                    // const pointsUl = document.querySelector("#points")
                    // const pointsLi = scoreUl.querySelector(".achievedpoints")
                    // const pointsSpan = pointsLi.querySelector("span")
                    // const currentPoints = parseInt(pointsSpan.textContent)
                    // const updatedPoints = currentPoints + 2
                } else if (completedButton.textContent === "Mark as Incomplete"){
                    const toDoList = document.querySelector('#to-do-chores')
                    toDoList.append(completedButton.parentElement)
                    completedButton.textContent = "Mark as Complete"
                    // DECREASE POINTS BY 2
                    // const pointsUl = document.querySelector("#points")
                    // const pointsLi = scoreUl.querySelector(".achievedpoints")
                    // const pointsSpan = pointsLi.querySelector("span")
                    // const currentPoints = parseInt(pointsSpan.textContent)
                    // const updatedPoints = currentPoints - 2
                }
            }
        }) 
    }

    getChores()
    submitHandler()
    clickHandler()

})






        /* 

    goalUrl = "http://localhost:3000/api/v1/goals/"


    const getGoals = () => {
        fetch(goalUrl)
        .then (response => response.json())
        .then(goals => {
            renderGoals(goals)
      })
    }

    const rendergoalss = goals => {
        goalList = document.querySelector("#goal-list")
        for(const goal of goals){
          renderGoal(goal, goalList)
        }
      }

    const renderGoal = (goal, goalList) => {
        // edit existing HTML
    }
  

    const submitHandler = () => {
        if(e.target.matches("#create-reward-form")){
        const rewardForm = document.querySelector("#create-reward-form")
        rewardForm.addEventListener("submit", function(e){
          e.preventDefault()
          const rewardForm = e.target
          //get values out of form
          const total = choreForm["total"].value
          const reward = choreForm["reward"].value        
        
          const newGoal = { total: total, reward: reward }
          
          // PATCH when have id
          // POST when don't have id 
          let goalMethod
          let submitUrl = baseUrl
          if(choreForm.dataset.id !== undefined){
              goalMethod = "PATCH"
              submitUrl += choreForm.dataset.id // adding id to baseUrl to make request to show
          } else(
              goalMethod = "POST"
          )

        rewardForm.reset()
        rewardForm.dataset.id = undefined // clear out dataset from form

        const options = {
            method: goalMethod,
            headers: {
              "content-type": "application/json",
              "accept": "application/json"
            },
            body: JSON.stringify(newGoal)
          }
          
          fetch(submitUrl, options)
          .then(response => response.json())
          .then(chore => {
            renderGoal(goal, goalList) 
          })

        })
    })
    }



        */
