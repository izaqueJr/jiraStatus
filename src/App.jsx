import React from 'react';
import copy from 'copy-text-to-clipboard';
import './App.css'

function App() {
 
  function AddTask(){
    chrome.tabs.query({active: true, currentWindow:true}, tabs=>{
      const activeTabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: {tabId: activeTabId},
          function: ()=>{
            let taskId = document.querySelector(".css-1gd7hga").innerText;

            let limitDate = document.querySelector(
              'div[data-testid="issue-field-date.ui.issue-field-date-read-view"]'
            ).innerText;
          
            let title = document.querySelector(
              'h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]'
            ).innerText;
              
            let qa = document.querySelector('button[aria-label="QA - Alterar status"]')

            let dev = document.querySelector('button[aria-label="Em Andamento - Alterar status"]')

            let open = document.querySelector('button[aria-label="Aberto - Alterar status"]')

            let pause = document.querySelector('button[aria-label="Pausada - Alterar status"]')

            let block = document.querySelector('button[aria-label="Bloqueada - Alterar status"]')

            let rework = document.querySelector('button[aria-label="Rework - Alterar status"]')

            qa && qa !== "QA" ? qa = "QA" : qa = ""
            dev && dev !== "Em Andamento" ? dev = "Em Andamento" : dev = ""
            open && open !== "Aberto" ? open = "Aberto" : open = ""
            pause && pause !== "Pausada" ? pause = "Pausada" : pause = ""
            block && block !== "Bloqueada" ? block = "Bloqueada" : block = ""
            rework && rework !== "Rework" ? rework = "Rework" : rework = ""
            
            console.log(qa, dev, open, pause, block, rework, "status !!!!")

            let taskContent = `
  Title: ${title}
  
  Task ID: ${taskId}

  Status: ${qa} ${dev} ${open} ${pause} ${block} ${rework}
  
  Limit Date: ${limitDate}
  
  -----------------------------------------------
             `;
          
             const getTaskData = (content) => {
              let actualData = localStorage.getItem("taskContent");
              console.log("actualData", actualData);
              actualData !== null
                ? (actualData = actualData + content)
                : (actualData = content);
          
              localStorage.setItem("taskContent", actualData);
              return actualData;
            };
          
            getTaskData(taskContent);
          }
        }
      )
    })


  }

  
  function CopyContent(){

    chrome.tabs.query({active: true, currentWindow:true}, tabs=>{
      const activeTabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: {tabId: activeTabId},
          //function: ()=>alert("React chrome extension alert")
          function: ()=>{
            let task = localStorage.getItem("taskContent")
            return task 
          }
        }
      ) .then(injectionResults => {
        for (const {frameId, result} of injectionResults) {
          console.log(`Frame ${frameId} result:`, result);
          document.getElementById("inputPreview").value = result
          copy(result);

        }
      });
    })

    document.getElementById("inputPreview").value = "task adicionada"
  }

  function Reset(){
    document.getElementById("inputPreview").value = ""

    chrome.tabs.query({active: true, currentWindow:true}, tabs=>{
      const activeTabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: {tabId: activeTabId},
          //function: ()=>alert("React chrome extension alert")
          function: ()=>{
            console.log("reset")
            localStorage.removeItem("taskContent")
          }
        }
      ) 
    })
  }

  return (
    <div className="App">
      <div className='buttons-container'>
        <button className="addTask" onClick={AddTask}>Adicionar Item</button>
        <button className="copyTask" onClick={CopyContent}>Copiar</button>
        <button className="resetTask" onClick={Reset}>Resetar</button>
      
          <input type="text" id="inputPreview" />

      </div>
    </div>
  );
}

export default App
