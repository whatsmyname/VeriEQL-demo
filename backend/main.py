import sys

sys.path.append("./verieql")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    schema: dict
    constraints: list


@app.post("/verify")
async def verify(benchmark: Benchmark):
    with Environment(generate_code=True, timer=False) as env:
        for k, v in benchmark.schema.items():
            env.create_database(attributes=v, bound_size=benchmark.bound, name=k)
        env.add_constraints(benchmark.constraints)
        env.save_checkpoints()
        if env._script_writer is not None:
            env._script_writer.save_checkpoints()

        ret = {}
        try:
            result = env.analyze(benchmark.query1, benchmark.query2)

            if not result:
                ret['decision'] = 'NEQ'
                ret['counterexample'] = dict(env.counterexample)
            else:
                ret['decision'] = 'EQU'
        except NotEquivalenceError:
            ret['decision'] = 'NEQ'
            ret['counterexample'] = {}
        except TimeoutError:
            ret['decision'] = 'TMO'
        except Exception as e:
            print(e)
            ret['decision'] = 'ERR'

    # print(benchmark)

    return ret
