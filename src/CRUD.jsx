import  {useState, useEffect, Fragment} from "react"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify"

const CRUD = () => {

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //new task
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [task, setTask] = useState('')
  const [isCompleted, setIsCompleted] = useState(0)

  // for added task
  const [editID, setEditId] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editTask, setEditTask] = useState('')
  const [editIsCompleted, setEditIsCompleted] = useState(0)

    const empdata = [
        {
            id: 1,
            title: "test",        // ✅ Use double or single quotes for strings
            task: "testing",
            isCompleted: 1
        },
        {
            id: 2,               // ✅ ID should be unique
            title: "hehe",
            task: "hehehuhu",
            isCompleted: 1
        }
    ]
    
    const [data, setData] = useState([])
    useEffect(() =>{
        getData()
    },[])

    const getData = () =>{
      axios.get('http://localhost:5186/api/Task')
      .then((result)=>{
        setData(result.data)
      })
      .catch((error)=>{
        console.log(error)
      })
    }

    const handleEdit =(id) => {
      const selectedTask = data.find(item => item.id === id);
    if (!selectedTask) return;

    setEditId(selectedTask.id);
    setEditTitle(selectedTask.title);
    setEditTask(selectedTask.task);
    setEditIsCompleted(selectedTask.isCompleted);
       // alert(id)
       handleShow()
       axios.get(`http://localhost:5186/api/Task/${id}`)
       .then((result)=>{
        setEditTitle(result.data.name)
        setEditTask(result.data.task)
        setEditIsCompleted(result.data.isCompleted)
        setEditId(id)
      })
      .catch((error)=>{
        console.log(error)
      })
    }



    const handleSave = () =>{
     const url = 'http://localhost:5186/api/Task'

     // Ensure a unique ID is assigned
    const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;

    const newData = {
      id: newId, // Assign a unique ID if needed
      title: title,
      task: task,
      isCompleted: isCompleted
    }
    //  const data = {

    //         "title" : title,
    //         "task" : task,
    //         "isCompleted" : isCompleted
    //  }

     axios.post(url, newData)
     .then((result) =>{
      getData()
      clear()
      toast.success('Task has been added')
     }).catch((error)=>{
      toast.error(error)
     })
    }

    const clear = () =>{
      setTitle('')
      setTask('')
      setIsCompleted(0)
      setEditTitle('')
      setEditTask('')
      setEditIsCompleted(0)
      setEditId('')
      
    }

    const handleIsCompletedChange = (e) =>{
      if(e.target.checked)
      {
        setIsCompleted(1)
      }
      else {
        setIsCompleted(0)
      }
    }

    const handleEditIsCompletedChange = (e) =>{
      if(e.target.checked)
      {
        setEditIsCompleted(1)
      }
      else {
        setEditIsCompleted(0)
      }
    }

    const handleDelete =(id) => {
        if(window.confirm("Are you sure?") == true)
        {
            axios.delete(`http://localhost:5186/api/Task/${id}`) 
            .then((result)=>{
              if (result.status === 200 || result.status === 204)
              {
                toast.success('Task has been deleted')
                // Optimistically remove the deleted task from UI
                setData(prevData => prevData.filter(task => task.id !== id));

                // Fetch the latest data
                getData();
              }
            })
            .catch((error)=>{
              toast.error(error)
    })
  }
        }
    
        const handleUpdate =() =>{
          const url = `http://localhost:5186/api/Task/${editID}`;
      
          const updatedData = {
              id: editID,
              title: editTitle,
              task: editTask,
              isCompleted: editIsCompleted
          };
      
          axios.put(url, updatedData)
              .then((result) => {
                  getData();
                  clear();
                  toast.success('Task updated successfully!');
                  handleClose();
              })
              .catch((error) => {
                  toast.error(error.message);
              });
      };
    

    return(
        <Fragment>
          <ToastContainer position="top-right" autoClose={3000} />

            <Container>
      <Row>
        <Col><input type="text" className="form-control" placeholder="Enter Task"
        value={title} onChange={(e) => setTitle(e.target.value)}
        />
        </Col>

        <Col><input type="text" className="form-control" placeholder="Enter Description"
        value={task} onChange={(e) => setTask(e.target.value)}
        /></Col>

        <Col><input type="checkbox" 
        checked={isCompleted === 1 ? true : false}
        onChange={(e) => handleIsCompletedChange(e)} value={isCompleted}
        />
        <label>Completed</label>
        </Col>

        <Col><button className="btn btn-primary" onClick={handleSave}>Submit</button></Col>
      </Row>
    </Container>
    <br></br>
            <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Task</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
            data && data.length> 0 ?
            data.map((item) => {
                return (
                    <tr key={item.id}>
          
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.task}</td>
                    <td>{item.isCompleted ? "Yes" : "No"}</td>
                    <td colSpan={2}>
                       <button className="btn btn-primary" onClick={()=> handleEdit(item.id)}>Edit</button> &nbsp;
                       <button className="btn btn-danger" onClick={()=> handleDelete(item.id)}>Delete</button> 
                       </td>
                  </tr>
                )
            })
            :
            'Loading..'
        }
        
      
      </tbody>
    </Table>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
        <Col>
        <input type="text" className="form-control" placeholder="Enter Task"
        value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
        />
        </Col>

        <Col><input type="text" className="form-control" placeholder="Enter Description"
        value={editTask} onChange={(e) => setEditTask(e.target.value)}
        /></Col>

        <Col><input type="checkbox" 
        checked={editIsCompleted === 1 ? true : false}
        onChange={(e) => handleEditIsCompletedChange(e)} value={editIsCompleted}
        />

        <label>Completed</label>
        </Col>
      </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        </Fragment>
    
    )
}
export default CRUD