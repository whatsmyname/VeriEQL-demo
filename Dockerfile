FROM python:3.11

WORKDIR /

RUN pip3 install virtualenv
RUN python3 -m venv venv

ENV PATH="/venv/bin:$PATH"

COPY frontend /frontend
COPY backend /backend

WORKDIR /backend
RUN pip install -r requirements.txt

WORKDIR /backend/verieql
RUN cp -fr z3py_libs/*.py /venv/lib/python3.11/site-packages/z3

RUN chmod -R 777 /frontend
RUN chmod -R 777 /backend

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]