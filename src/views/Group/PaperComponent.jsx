import React, { useEffect, useState } from 'react';
import { Table, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSecurity } from './../../context/Security';
const baseUrl = process.env.REACT_APP_BASE_URL;

const PaperComponent = ({ groupId }) => {
  const { encrypt } = useSecurity();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/api/Papers`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch papers');
        }
        return response.json();
      })
      .then(data => {
        const filteredPapers = data.filter(paper => parseInt(paper.groupID) === parseInt(groupId));
        setPapers(filteredPapers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching papers:', error);
        setError('Failed to fetch papers');
        setLoading(false);
      });
  }, [groupId]);

  return (
    <Card>
      <Card.Header className='d-flex align-items-center justify-content-between'>
        <h4>Papers</h4>
        <Link to={`/Masters/AddPaper`} className="btn btn-primary">
          Add New Paper
        </Link>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : papers.length === 0 ? (
          <div className="alert alert-info">No papers found for this Group.</div>
        ) : (
          <Table bordered hover striped>
            <thead>
              <tr>
                <th>Catch Number</th>
                <th>Paper Code</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {papers.map(paper => (
                <tr key={paper.paperID}>
                  <td>{paper.catchNumber}</td>
                  <td>{paper.paperCode}</td>
                  <td>
                    <Link to={`/Masters/papers/ViewPaper/${encrypt(paper.paperID)}`} className='btn btn-primary'>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

PaperComponent.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default PaperComponent;
