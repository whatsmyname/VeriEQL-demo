import sys
import traceback

sys.path.append("./verieql")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from verieql.constants import DIALECT
from verieql.environment import Environment
from verieql.errors import *


app = FastAPI()

origins = [
    'http://localhost:3000',
    'http://localhost:8000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Benchmark(BaseModel):
    query1: str
    query2: str
    bound: int
    table_schema: dict = Field(default=None, alias='schema')
    constraints: list
    dialect: str


@app.post("/verify")
async def verify(benchmark: Benchmark):
    if benchmark.dialect == 'MySQL':
        dialect = DIALECT.MYSQL
    elif benchmark.dialect == 'MariaDB':
        dialect = DIALECT.MARIADB
    elif benchmark.dialect == 'PostgreSQL':
        dialect = DIALECT.POSTGRESQL
    elif benchmark.dialect == 'Oracle':
        dialect = DIALECT.ORACLE
    else:
        dialect = DIALECT.ALL

    ret = {}
    try:
        with Environment(generate_code=True, timer=False, show_counterexample=True, dialect=dialect) as env:
            for k, v in benchmark.table_schema.items():
                env.create_database(attributes=v, bound_size=benchmark.bound, name=k)
            env.add_constraints(benchmark.constraints)
            env.save_checkpoints()
            if env._script_writer is not None:
                env._script_writer.save_checkpoints()

            try:
                result = env.analyze(benchmark.query1, benchmark.query2, out_file='tmp/smt.py')

                if not result:
                    ret['decision'] = 'NEQ'
                    if env.counterexample:
                        ret['counterexample'] = dict(env.counterexample_dict)
                        ret['counterexample_sql'] = env.sql_code.replace('`', '')
                    else:
                        ret['counterexample'] = {}
                        ret['counterexample_sql'] = ''
                elif result == -1:
                    raise NotEquivalenceError
                else:
                    ret['decision'] = 'EQU'

                with open('tmp/smt.py', 'r') as smt_file:
                    ret['pysmt_formula'] = smt_file.read().replace('`', '')
            except NotEquivalenceError:
                ret['decision'] = 'NEQ'
                ret['counterexample'] = {}
                ret['counterexample_sql'] = ''
                ret['pysmt_formula'] = ''

                # with open('tmp/smt.py', 'r') as smt_file:
                #     ret['pysmt_formula'] = smt_file.read().replace('`', '')
            except TimeoutError:
                ret['decision'] = 'TMO'
    except Exception as e:
        print(''.join(traceback.format_tb(e.__traceback__)) + str(e))
        ret['decision'] = 'ERR'

    return ret
