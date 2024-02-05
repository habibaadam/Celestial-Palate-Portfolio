from flask import Flask, jsonify, request, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from app.database import DBSession
from datab import Customer, Payment, Reservation, Base

app = Flask(__name__)

reservation = Blueprint('reservation', __name__)

@reservation.route('/', methods=['POST'])
def create_reservation() -> Response:
    if request.method == 'POST':
        session = DBSession()
        # Assuming request contains customer_id, payment_id, and num_of_guests
        new_reservation = Reservation(customer_id=request.json['customer_id'], payment_id=request.json['payment_id'], num_of_guests=request.json['num_of_guests'],
                                      created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        session.add(new_reservation)
        session.commit()
        session.close()
        return jsonify(message="Reservation created successfully")
    
@reservation.route('/<reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    session = DBSession()
    reservation = session.query(Reservation).filter_by(id=reservation_id).first()
    session.close()
    if reservation:
        return jsonify(reservation={'id': reservation.id, 'customer_id': reservation.customer_id, 'payment_id': reservation.payment_id, 'num_of_guests': reservation.num_of_guests, 'created_at': reservation.created_at, 'updated_at': reservation.updated_at})
    else:
        return jsonify(message="Reservation not found"), 404
    
@reservation.route('/<reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    session = DBSession()
    reservation = session.query(Reservation).filter_by(id=reservation_id).first()
    if reservation:
        session.delete(reservation)
        session.commit()
        session.close()
        return jsonify(message="Reservation deleted successfully")
    else:
        session.close()
        return jsonify(message="Reservation not found"), 404
    
@reservation.route('/<reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    session = DBSession()
    reservation = session.query(Reservation).filter_by(id=reservation_id).first()
    if reservation:
        reservation.num_of_guests = request.json['num_of_guests']
        reservation.updated_at = datetime.utcnow()
        session.commit()
        session.close()
        return jsonify(message="Reservation updated successfully")
    else:
        session.close()
        return jsonify(message="Reservation not found"), 404
