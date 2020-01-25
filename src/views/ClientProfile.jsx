import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import ClientModal from '../components/Modals/ClientModal';
import ConfirmModal from "../components/Modals/ConfirmModal";
import { LoadingSpinner } from "../components/Shared/LoadingSpinner";
import ClientContact from "./ClientContact";
import ClientOrder from "./ClientOrder";


const ClientProfile = (props) => {
  const [client, setClient] = useState({});
  const [isFetchingClient, setFetchingClient] = useState(false);
  const [isDeletingClient, setDeletingClient] = useState(false);
  const [isCreatingOrder, setCreatingOrder] = useState(false);
  const [isUpdatingClientModelOpened, setUpdatingClientModelOpened] = useState(false);
  const [isDeletingClientModelOpened, setDeletingClientModelOpened] = useState(false);

  const { clientId } = useParams();

  const renderClientContactAndActions = () => {
    return (
      <div className="d-flex flex-grow-1 align-items-center justify-content-end mr-2">
        <ClientContact client={client} />

        <div className="text-center ml-3" style={{ cursor: 'pointer' }}>
          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <i className="fas fa-ellipsis-h"></i>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => setUpdatingClientModelOpened(true)}>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 40 }}>
                  <i style={{ color: "#5e72e4" }} className="fas fa-user-edit mr-1"></i>
                  <span>Edit</span>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => setDeletingClientModelOpened(true)}>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 40 }}>
                  <i style={{ color: '#f5365c' }} className="fas fa-trash-alt mr-1"></i>
                  <span>Delete</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>)

  }


  const onDeletingClientHandler = async () => {
    setDeletingClient(true);
    try {
      await Axios({
        method: 'delete',
        url: `${process.env.REACT_APP_API_URL}/clients/${clientId}`,
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      alert(error);
    }

    setDeletingClient(false);
    props.history.push('/dashboard/clients')
  }


  const fetchClientData = async () => {
    setFetchingClient(true)
    try {
      const res = await Axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/clients/${clientId}`,
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
      });

      setClient(res.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404)
          return props.history.push('/dashboard/404');
      }
      alert(error);
    }

    setFetchingClient(false);
  }


  useEffect(() => {
    props.setNavbarOpts({ text: 'Client Profile' });
    fetchClientData();
  }, [])

  const onOrderCeationHandler = async () => {
    setCreatingOrder(true)
    try {
      const res = await Axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/clients/${clientId}/orders`,
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
      });

      return props.history.push(`/dashboard/clients/${clientId}/orders/${res.data._id}`);
    } catch (error) {
      alert(error);
    }

    setCreatingOrder(false);
  }


  return (
    <>
      {
        isUpdatingClientModelOpened && <ClientModal setOpened={setUpdatingClientModelOpened} isOpened={isUpdatingClientModelOpened}
          updatedClientHandler={(client) => setClient(client)}
          existingClient={client} />
      }
      {
        isDeletingClientModelOpened && <ConfirmModal setOpened={setDeletingClientModelOpened} isOpened={isDeletingClientModelOpened}
          message={`Are you sure deleting "${client.name}" ?`}
          acceptanceComponent={
            <Button color="primary" onClick={onDeletingClientHandler}>
              {isDeletingClient ? <LoadingSpinner fontSize={18} /> : "yes"}
            </Button>
          }
          rejectionText="no"
        />
      }

      <div className="d-flex flex-column p-10 bg-white flex-grow-1">
        <div className="d-flex m-3 justify-content-between align-items-center">
          <Button color="primary" onClick={onOrderCeationHandler}>{isCreatingOrder ? <LoadingSpinner fontSize={18} /> : "Add New Order"}</Button>

          {Object.keys(client).length > 0 && renderClientContactAndActions()}

          {isFetchingClient && <LoadingSpinner />}
        </div>

        <ClientOrder clientId={clientId} style={{ flex: 1 }} />
      </div>
    </>
  );
}



export default ClientProfile;
