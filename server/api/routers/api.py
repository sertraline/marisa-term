from fastapi import APIRouter, Request
from ..controllers.TermController import TermController
from ..services.TermService import TermService
from .. import modules
import sys
sys.path.append('...')
import config


router = APIRouter()
service = TermService(config, modules)
controller = TermController(service)


@router.get('/')
async def index(request: Request):
    return await controller.index(request)


@router.post('/encode')
async def encode(request: Request):
    return await controller.encode(request)


@router.post('/decode')
async def encode(request: Request):
    return await controller.decode(request)


@router.post('/convert')
async def encode(request: Request):
    return await controller.convert(request)


@router.post('/host')
async def encode(request: Request):
    return await controller.host(request)


@router.post('/weather')
async def encode(request: Request):
    return await controller.weather(request)
