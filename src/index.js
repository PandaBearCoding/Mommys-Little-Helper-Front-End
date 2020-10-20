document.addEventListener("DOMContentLoaded", () => {

    const submitHandler = () => {
        const choreForm = document.querySelector("#create-chore-form")
        choreForm.addEventListener("submit", function(e){
          e.preventDefault()
          const choreForm = e.target
          const familyMember = choreForm["family"].value
          const priority = choreForm["priority"].value        
          const dueDate = choreForm["chore-due-date"].value     
          const description = choreForm["new-chore-description"].value 

          const choreLi = document.createElement('li')
          //choreLi.dataset.choreId = choreLi.id --> need for PATCH?

        choreLi.innerHTML = `Family Member: ${familyMember},  Due Date: ${dueDate},  Chore: ${description},  <span class=${priority}> Priority: ${priority} </span>`
          
          const deleteButton = document.createElement("button")
              deleteButton.textContent = "Delete"
              deleteButton.classList.add("delete")
              choreLi.append(deleteButton)

            const editButton = document.createElement("button")
              editButton.textContent = "Edit"
              editButton.classList.add("edit")
              choreLi.append(editButton)
            
            const completedButton = document.createElement("button")
              completedButton.textContent = "Mark as Complete"
              completedButton.classList.add("completed")
              choreLi.append(completedButton)
          
              const choreList = document.querySelector('#to-do-chores')
              choreList.append(choreLi)
          
        choreForm.reset()

        })
    }

    const clickHandler = () => {
        document.addEventListener("click", function(e){
            if(e.target.matches(".delete")){
                const deleteButton = e.target
                deleteButton.parentElement.remove()
            }
            else if (e.target.matches(".edit")){
                const editButton = e.target
                // access li
                const li = editButton.parentElement
                console.log(li)
                // access info on the li



                // const words = li.innerHTML.split(/\s+/)
                // const familyMember = words[2]
                // const dueDate = words[6]
                // const description = words[9]
                // console.log(familyMember, dueDate, description)
                /*
                choreLi.innerHTML = `Family Member: ${familyMember},  Due Date: ${dueDate},  Chore: ${description},  <span class=${priority}> Priority: ${priority} </span>`
                */
                 


            }
            else if (e.target.matches(".completed")){
                const completedButton = e.target
                if (completedButton.textContent === "Mark as Complete"){
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

    submitHandler()
    clickHandler()

})



