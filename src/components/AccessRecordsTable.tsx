import { useState, useEffect } from 'react';
import { Table, Badge, Spinner, Form, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { AccessRecord } from '../types/database';

export default function AccessRecordsTable() {
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceFilter, setDeviceFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      setLoading(true);
      let query = supabase
        .from('access_records')
        .select('*')
        .order('timestamp', { ascending: false });

      if (deviceFilter) {
        query = query.ilike('device_id', `%${deviceFilter}%`);
      }
      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (success: boolean) => (
    <Badge bg={success ? 'success' : 'danger'}>
      {success ? 'Success' : 'Failed'}
    </Badge>
  );

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Access Records</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Device ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter device ID"
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && fetchRecords()}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Action</Form.Label>
            <Form.Select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                fetchRecords();
              }}
            >
              <option value="">All Actions</option>
              <option value="PIN_ENTRY">PIN Entry</option>
              <option value="TIMEOUT">Timeout</option>
              <option value="MASTER_RESET">Master Reset</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Device ID</th>
            <th>Action</th>
            <th>Status</th>
            <th>PIN</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{format(new Date(record.timestamp), 'PPpp')}</td>
              <td>{record.device_id || 'N/A'}</td>
              <td>
                <Badge bg="info">{record.action}</Badge>
              </td>
              <td>{getStatusBadge(record.success)}</td>
              <td>{record.pin || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
