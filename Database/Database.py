from flask import Flask, url_for, render_template, request, make_response, session, g, redirect
import mysql.connector
from mysql.connector import errorcode

app = Flask(__name__)

def get_db():
    if not hasattr(g, "_database"):
        try:
            g._database = mysql.connector.connect(user="root", password="moriarty", host="127.0.0.1", database="webshop")
        except mysql.connector.Error as err:
            print("Error: database connection failed")
    return g._database

@app.teardown_appcontext
def teardown_db(error):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    try:
        db = get_db()
        cur = db.cursor(buffered=True)
        sql = ("SELECT DISTINCT produkttype "
               "FROM produkt")
        cur.execute(sql)
        prodtypes = []
        for i in range(0,cur.rowcount):
            row = cur.fetchone()
            print(row[0])
            prodtypes.append(row[0])
        sql = ("SELECT brukernavn "
               "FROM kunde")
        cur.execute(sql)
        users = []
        for i in range(0,cur.rowcount):
            row = cur.fetchone()
            users.append(row[0])
        cur.close()
        return render_template("index.html", prodtypes = prodtypes, userlist = users)
    except mysql.connector.Error as err:
        print("Error: {}".format(err.msg))

@app.route('/products',methods=["POST"])
def produkt():
    prodtype = request.form["typeselect"]
    try:
        db = get_db()
        cur = db.cursor(buffered=True)
        sql = ("SELECT produktID, navn, standardpris, tilbudspris, bilde "
               "FROM produkt WHERE produkt.produktType = %s")
        cur.execute(sql,(prodtype,))
        PRODUCTS = []
        for i in range(0,cur.rowcount):
            row = cur.fetchone()
            product = {"productID": row[0], "name": row[1], "price": row[2], "saleprice": row[3], "image": row[4] }
            PRODUCTS.append(product)
        cur.close()
        resp = make_response(render_template("products.html", products=PRODUCTS))
        return resp
    except mysql.connector.Error as err:
        print("Error: {}".format(err.msg))

@app.route('/orders/',methods=["POST"])
def orders():
    try:
        db = get_db()
        cur = db.cursor(buffered=True)
        sql = ("SELECT bestillingID, leveringsID "
               "FROM bestilling  WHERE kunde=%s")
        user = request.form["user"]
        cur.execute(sql, (user,))
        orders = []
        for i in range(0,cur.rowcount):
            row = cur.fetchone()
            order = {"orderID": row[0], "deliveryID": row[1]}
            orders.append(order)
        cur.close()
        resp = make_response(render_template("orders.html", orders=orders, user=user))
        return resp
    except mysql.connector.Error as err:
        print("Error: {}".format(err.msg))
@app.route('/orders/<orderID>')
def order(orderID):
    try:
        db = get_db()
        cur = db.cursor(buffered=True)
        sql = ("SELECT bp.produktID, p.produktType, p.navn, bp.antall, p.standardpris "
               "FROM bestiltprodukt bp JOIN produkt p ON bp.produktID = p.produktID "
               "WHERE bestillingID=%s")
        cur.execute(sql, (orderID,))
        order = []
        orderSum = 0;
        for i in range(0,cur.rowcount):
            row = cur.fetchone()
            item = {"productID": row[0], "type": row[1],"name": row[2], "amount": row[3], "price": row[4], "totalprice":row[3]*row[4]}
            orderSum += (item["price"]*item["amount"])
            order.append(item)
        cur.close()
        resp = make_response(render_template("order.html", order=order, orderID=orderID, orderSum=orderSum))
        return resp
    except mysql.connector.Error as err:
        print("Error: {}".format(err.msg))
@app.route('/register')
def register():
    return render_template("register.html")

@app.route('/register/complete', methods=["POST"])
def complete():
    try:
        db = get_db()
        cur = db.cursor(buffered=True)
        sql = ("INSERT INTO kunde() VALUES(%s,%s,%s,%s,%s,%s,%s)")
        user = request.form
        print(sql)
        print(user)
        cur.execute(sql,(user["username"], user["name"], user["address"], user["phone"], user["email"], user["admin"],user["password"]))
        db.commit()
        cur.close()
        resp = make_response(render_template("complete.html", exitcode=1))
        return resp
    except mysql.connector.Error as err:
        print("Error: {}".format(err.msg))
        resp = make_response(render_template("complete.html", exitcode=0))
        return resp

if __name__ == '__main__':
    app.run()
